from typing import Literal, cast, Any, Callable, List, Optional
import os

import requests
import json
import smtplib
from dotenv import load_dotenv
from langgraph.graph import END, START, StateGraph, MessagesState
from langchain_community.vectorstores import Chroma
from langchain_groq import ChatGroq
from langchain_core.tools import tool
from langchain_community.document_loaders import PyMuPDFLoader
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
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

def add(a: int, b: int) -> int:
    """Add two integers.

    Args:
        a: First integer
        b: Second integer
    """
    return a + b


def multiply(a: int, b: int) -> int:
    """Multiply two integers.

    Args:
        a: First integer
        b: Second integer
    """
    return a * b

def yahoo_finance_news(query: str, *, config: Annotated[RunnableConfig, InjectedToolArg]) -> Optional[list[dict[str, Any]]]:
    """Search for general web results.

    This function performs a search using the Tavily search engine, which is designed
    to provide comprehensive, accurate, and trusted results. It's particularly useful
    for answering questions about current events.
    """
    result = YahooFinanceNewsTool._run(query)
    return cast(list[dict[str, Any]], result)

def send_email(query: str):
    """Send an email.

    This function sends an email about the text passed in.
    """
    
    sender_email = os.getenv('SENDER_EMAIL', None)
    recipient_email = os.getenv('RECIPIENT_EMAIL', None)
    sender_password = os.getenv('SENDER_PASSWORD', None)
    if sender_email or recipient_email or sender_password is None:
        raise Exception("Email credentials not found.")
    
    try:
        # Connect to the SMTP server
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, query)
        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")
    return

# get data from starknet id tool
# sample question: what is the data of starknet id 1
def get_data_from_starknet_id (starknet_id: str):
    """Retrieve the data of a Starknet ID.
    Arg: starknet_id
    """
    url = "https://api.Starknet.id/id_to_data"
    
    params = {"id": starknet_id}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return json.dumps(response.json(), indent=4)
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}
    
# get address and expiry date of a domain tool
# sample question: what address is fricoben.stark
def get_address_from_starknet_domain (domain: str):
    """Retrieve the associated address and its expiry date for a given domain.
    Arg: domain"""
    url = "https://api.starknet.id/domain_to_addr"
    
    params = {"domain": domain}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return json.dumps(response.json(), indent=4)
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}
    
# get the NFT uri from a starknet id tool
# sample question: whwat is the nft uri of starknet id 12
def uri_of_starknet_id (starknet_id: str):
    """Retrieve the NFT uri of a Starknet ID.
    arg: starknet_id"""
    url = "https://api.Starknet.id/uri"
    
    params = {"id": starknet_id}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return json.dumps(response.json(), indent=4)
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

# get all nfts by account tool
# sample question: what are the nfts in this address: 0x06a8e001355e8a8436ccef288bdb42fce04b2853ed7b7dacde4e3693ceb95b2b"
def get_nft_by_account (account_address: str, show_attribute: bool | None = None, sort_field: str | None = None, sort_direction: str | None = None):
    """returns all NFTs owned by an account address.
    arg: account_address
    optional args: show_attribute as a bool, sort_field by mint_time, own_time, and latest_trade_price, and sort_direction as asc or desc"""
    url = f"https://starknetapi.nftscan.com/api/v2/account/own/all/{account_address}?erc_type=&show_attribute=false&sort_field=&sort_direction="

    params = {
        'show_attribute': show_attribute,
        'sort_field': sort_field,
        'sort_direction': sort_direction
    }
    
    netscan_api_key = os.getenv('NFT_SCAN_API_KEY', None)
    if netscan_api_key is None:
        raise Exception("NetScan credentials not found.")

    headers = {'X-API-KEY': netscan_api_key}
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        return json.dumps(response.json(), indent=4)
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

# search collections tool
# sample question: give me all the info about the collections at this contact address: 0x060c7bac593716c5ab7b9dcb98c2cb97dcee9eef49bd2e8329383b35f7232452
def search_collections (
        contract_address_list: List[str],
        block_number_start: Optional[int] = None,
        block_number_end: Optional[int] = None,
        limit: int = 20,
        name: Optional[str] = None,
        name_fuzzy_search: bool = False,
        offset: Optional[int] = None,
        show_collection: bool = False,
        sort_direction: str = "asc",
        sort_field: str = "create_block_number",
        symbol: Optional[str] = None,
        twitter: Optional[str] = None
    ):
    """Searches NFT collections based on the given parameters.

    :param contract_address_list: List of contract addresses to filter (required).
    :param block_number_start: Start block number for filtering (optional).
    :param block_number_end: End block number for filtering (optional).
    :param limit: Number of results to return (default: 20) (optional).
    :param name: Name of the collection to filter (optional).
    :param name_fuzzy_search: Whether to enable fuzzy search for the name (default: False) (optional).
    :param offset: Offset for pagination (optional).
    :param show_collection: Whether to obtain collections with the same name (default: False) (optional).
    :param sort_direction: Direction to sort results (asc or desc, default: asc) (optional).
    :param sort_field: Field to sort results by (default: create_block_number) (optional).
    :param symbol: Symbol to filter collections by (optional).
    :param twitter: Twitter handle to filter collections by (optional).
    :return: The response from the API."""
    url = f"https://starknetapi.nftscan.com/api/v2/collections/filters"

    payload = {
        "contract_address_list": contract_address_list,
        "block_number_start": block_number_start,
        "block_number_end": block_number_end,
        "limit": limit,
        "name": name,
        "name_fuzzy_search": name_fuzzy_search,
        "offset": offset,
        "show_collection": show_collection,
        "sort_direction": sort_direction,
        "sort_field": sort_field,
        "symbol": symbol,
        "twitter": twitter
    }
    
    netscan_api_key = os.getenv('NFT_SCAN_API_KEY', None)
    if netscan_api_key is None:
        raise Exception("NetScan credentials not found.")

    headers = {'Content-Type':'application/json',
               'X-API-KEY': netscan_api_key}

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()
        return json.dumps(response.json(), indent=4)
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

def cairo_rag():

    file_path="blocks/server/documents/cairo_programming_language.pdf"
    
    def document_ingestion(file_path):
        documents = []
        pdf_reader = PyMuPDFLoader(file_path=file_path).load()
        documents.extend(pdf_reader)
        print("document ingested")
        return documents

    def text_splitting(documents):
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1500,
            chunk_overlap=200,
        )
        chunks = text_splitter.split_documents(documents=documents)
        print("document split into chunks")
        return chunks

    def store_into_vectorstore(chunks : None):
        embedding_function = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        db_path = 'blocks/server/vectorstore/db_chroma'

        # create a new DB from the documents or take the existing DB from local
        if os.path.exists(db_path):
            vectordb = Chroma(persist_directory=db_path, embedding_function=embedding_function)
            print("vectorstore loaded from local")
        else:
            vectordb = Chroma.from_documents(documents=chunks, embedding=embedding_function, persist_directory=db_path)
            print("vectorstore saved to local")

        return vectordb
    
    def conversation_chain(vectordb):
        basic_retriever = vectordb.as_retriever(search_kwargs={'k': 3})

        qa_system_prompt = """<|begin_of_text|><|start_header_id|>system<|end_header_id|>As an AI tool assisting an AI agent helping a Starknet developer.
        If the documents are relevant to the question, give the information from the documents to the AI agent.
        You are connected to a RAG system that gave you the provided documents, and it is a complete database of all the information you need to know.
        Your response should adhere to the following guidelines:
        - Answer the question by only using the provided documents.
        - Do not fabricate any information or data.
        - Be straightforward.<|eot_id|>
        <|start_header_id|>user<|end_header_id|> 
        Question: {input} 
        Context: {context}
        <|eot_id|><|start_header_id|>assistant<|end_header_id|>"""

        qa_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", qa_system_prompt),
                ("human", "{input}"),
            ]
        )

        groq_api_key = os.getenv('GROQ_API_KEY', None)
        if groq_api_key is None:
            raise Exception("Groq api key not found.")

        model = ChatGroq(
            model="llama3-groq-8b-8192-tool-use-preview",
            temperature=0.0,
            max_tokens=8000,
            api_key=groq_api_key
            )

        question_answer_chain = create_stuff_documents_chain(model, qa_prompt)
        rag_chain = create_retrieval_chain(basic_retriever, question_answer_chain)
        return rag_chain
    
    if os.path.exists(file_path):
        vectorstore = store_into_vectorstore(chunks=None)
        chain = conversation_chain(vectorstore)
        return chain
    else:
        documents = document_ingestion(file_path)
        chunks = text_splitting(documents)
        vectorstore = store_into_vectorstore(chunks=chunks)
        chain = conversation_chain(vectorstore)
    return chain


def cairo_rag_tool(query: str):
    """This tool is used to get information related to Cairo programming.
    Arg: query"""
    rag_chain = cairo_rag()
    response = rag_chain.invoke({"input": query})
    context = response['context']
    document_data = str([document.page_content for document in context])
    return document_data;

TOOLS = {
    "add": add,
    "multiply": multiply,
    "yahoo finance news" : yahoo_finance_news,
    "email" :  send_email,
    "starknet_id_data" : get_data_from_starknet_id,
    "starknet_domain_data" : get_address_from_starknet_domain,
    "nft_uri" : uri_of_starknet_id,
    "nft by account" : get_nft_by_account,
    "search collections" : search_collections,
    "cairo documentation" : cairo_rag_tool
}   

@traceable
def invoke_agent(requested_tools):
    agent_tools = []
    for tool in requested_tools:
        if tool in TOOLS.keys():
            agent_tools.append(TOOLS[tool])

    tool_node = ToolNode(agent_tools)

    groq_api_key = os.getenv('GROQ_API_KEY', None)
    if groq_api_key is None:
        raise Exception("Groq api key not found.")

    model = ChatGroq(
        model="llama3-groq-8b-8192-tool-use-preview",
        temperature=0.0,
        max_tokens=8000,
        api_key=groq_api_key
        )

    model_with_tools = model.bind_tools(agent_tools)

    def should_continue_to_tool(state: MessagesState) -> Literal["tools", END]:
        messages = state['messages']
        last_message = messages[-1]
        if last_message.tool_calls:
            return "tools"
        return END
    
    def should_continue_to_agent(state: MessagesState) -> Literal["agent", END]:
        messages = state['messages']
        last_message = messages[-1]
        if len(last_message.content) < 6000:
            return "agent"
        return END

    def call_model(state: MessagesState):
        messages = state['messages']
        response = model_with_tools.invoke(messages)
        
        return {"messages": [response]}

    workflow = StateGraph(MessagesState)

    # cycles between agent & node
    workflow.add_node("agent", call_model)
    workflow.add_node("tools", tool_node)

    # setting the entry node as agent
    workflow.add_edge(START, "agent")

    # after agent is called, it is conditional if tool is called
    workflow.add_conditional_edges("agent",should_continue_to_tool)
    # after tool is called, it is conditional if the agent is called
    workflow.add_conditional_edges("tools", should_continue_to_agent)

    # memory
    checkpointer = MemorySaver()
    app = workflow.compile()

    response = ""
    for chunk in app.stream(
        {"messages": [("human", "what is cairo programming?")]},
        {"configurable": {"thread_id": "thread-1"}},
        stream_mode="values"):
        response = chunk["messages"][-1]

    # agent = create_react_agent(model, agent_tools)
    # response = agent.invoke({"messages": [("human", "what's 2 + 2")]})
    return response

def handle_agent_request():

    return "Agent endpoint reached" 

if __name__ == "__main__":
    response = invoke_agent(["add", "starknet_id_data", "starknet_domain_data", "nft_uri", "nft by account", "search collections", "cairo documentation"])
    print(response.content)

    
    