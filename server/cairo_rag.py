from typing import Literal, cast, Any, Callable, List, Optional
import os

import requests
import json
import smtplib
from dotenv import load_dotenv
from langgraph.graph import END, START, StateGraph, MessagesState
from langchain_community.vectorstores import Chroma
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_community.document_loaders import PyMuPDFLoader
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.tools.yahoo_finance_news import YahooFinanceNewsTool
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import InjectedToolArg
from typing_extensions import Annotated
from langsmith import traceable

load_dotenv()

def document_ingestion(file_path):
    documents = []
    pdf_reader = PyMuPDFLoader(file_path=file_path).load()
    documents.extend(pdf_reader)
    print("document ingested")
    return documents

def text_splitting(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=500,
    )
    chunks = text_splitter.split_documents(documents=documents)
    print("document split into chunks")
    return chunks

def store_into_vectorstore(file_path, db_path, force_regenerate=False, chunks=None):
    # Using MiniLM for consistency with existing vectorstore
    embedding_function = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'}
    )

    try:
        # If vectorstore exists and no force regenerate, load existing
        if os.path.exists(db_path) and not force_regenerate and chunks is None:
            vectordb = Chroma(persist_directory=db_path, embedding_function=embedding_function)
            print("vectorstore loaded from local")
        else:
            # If no vectorstore or force regenerate or new chunks provided, create new one
            if chunks is None:
                print("Creating new vectorstore from PDF...")
                documents = document_ingestion(file_path)
                chunks = text_splitting(documents)
            
            # Remove existing vectorstore if it exists
            if os.path.exists(db_path):
                import shutil
                shutil.rmtree(db_path)
                print("Removed existing vectorstore")
            
            vectordb = Chroma.from_documents(
                documents=chunks,
                embedding=embedding_function,
                persist_directory=db_path,
                collection_metadata={"hnsw:space": "cosine"}
            )
            print("vectorstore created and saved to local")
            vectordb.persist()
    
    except Exception as e:
        print(f"Error with vectorstore: {e}")
        # If there's any error, try recreating the vectorstore
        if os.path.exists(db_path):
            import shutil
            shutil.rmtree(db_path)
            print("Removed existing vectorstore due to error")
        
        documents = document_ingestion(file_path)
        chunks = text_splitting(documents)
        vectordb = Chroma.from_documents(
            documents=chunks,
            embedding=embedding_function,
            persist_directory=db_path,
            collection_metadata={"hnsw:space": "cosine"}
        )
        print("vectorstore recreated after error")
        vectordb.persist()

    return vectordb

def query_cairo_docs(query: str, force_regenerate: bool = False) -> dict:
    """Query the Cairo documentation using RAG.
    
    Args:
        query: The question to ask about Cairo
        force_regenerate: If True, forces regeneration of the vectorstore even if it exists
        
    Returns:
        dict containing the context documents and final answer
    """
    # Setup paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, "documents", "cairo_programming_language.pdf")
    db_path = os.path.join(script_dir, "vectorstore", "db_chroma")
    
    print(f"Looking for PDF at: {file_path}")
    
    if not os.path.exists(file_path):
        raise Exception(f"Cairo documentation PDF not found at {file_path}")

    # Initialize vectorstore
    vectorstore = store_into_vectorstore(file_path, db_path, force_regenerate=force_regenerate)
    
    # More sophisticated retrieval strategy
    retriever = vectorstore.as_retriever(
        search_type="mmr",  # Using Maximum Marginal Relevance
        search_kwargs={
            'k': 5,  # Get more documents initially
            'fetch_k': 20,  # Fetch more candidates
            'lambda_mult': 0.7,  # Diversity factor
        }
    )

    # Get relevant documents
    context_docs = retriever.get_relevant_documents(query)
    
    # Filter and rerank the documents based on relevance
    filtered_docs = []
    seen_content = set()
    for doc in context_docs:
        # Skip if content is too similar to what we've already included
        if doc.page_content.strip() in seen_content:
            continue
        # Skip if content seems irrelevant (you can adjust these conditions)
        if len(doc.page_content.strip()) < 50:  # Skip very short snippets
            continue
        filtered_docs.append(doc)
        seen_content.add(doc.page_content.strip())
        if len(filtered_docs) >= 3:  # Keep top 3 most relevant unique chunks
            break
    
    # Setup prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an AI assistant helping with Cairo programming questions.
        You MUST use the provided context from the RAG system to answer questions.
        
        Rules:
        1. ONLY use information from the provided context
        2. Do not make up or infer information
        3. Be direct and specific
        4. Include code examples when they are available in the context
        
        Context: {context}
        Question: {question}"""),
        ("human", "{question}")
    ])

    # Setup LLM
    llm = ChatOpenAI(
        model="gpt-4",
        temperature=0,
        timeout=None,
        max_retries=2
    )

    # Format context with better structure
    context = "\n\n---\n\n".join([
        f"Excerpt {i+1}:\n{doc.page_content}"
        for i, doc in enumerate(filtered_docs)
    ])
    
    # Get response
    response = prompt.invoke({
        "context": context,
        "question": query
    }).to_messages()
    
    answer = llm.invoke(response).content

    return {
        "context": filtered_docs,
        "answer": answer
    }

if __name__ == "__main__":
    print("Testing Cairo RAG system...")
    
    # Test with force_regenerate=True to rebuild the vectorstore
    query = "How do I create and use a storage variable in Cairo?"
    force_regenerate = False  # Set to True to force vectorstore regeneration
    
    print(f"\nQuery: {query}")
    print(f"\nForce regenerate vectorstore: {force_regenerate}")
    print("\nSearching Cairo documentation...")
    
    try:
        response = query_cairo_docs(query, force_regenerate=force_regenerate)
        
        print("\nContext from RAG system:")
        for i, doc in enumerate(response["context"]):
            print(f"\nDocument {i+1}:")
            print(doc.page_content)
            print("-" * 80)
            
        print("\nFinal Answer:")
        print(response["answer"])
        
    except Exception as e:
        print(f"\nError occurred during testing: {e}")
        import traceback
        traceback.print_exc()

    