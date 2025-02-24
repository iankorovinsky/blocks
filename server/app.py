from flask import Flask
from flask_cors import CORS
# from agent import invoke
from cairo_rag import query_cairo_docs
from flask import request

from deployer import handle_deploy_request, save_code_to_file, handle_verify_request
import os
from flask import request
from contract_builder import ContractBuilder

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": "*"}})

@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json(force=True)
    prompt = data.get('prompt')
    force_regenerate = data.get('force_regenerate', False)
    print(f"Received request - Prompt: {prompt}")
    
    try:
        result = query_cairo_docs(prompt, force_regenerate=force_regenerate)
        response_data = {
            "answer": result["answer"],
            "context": [doc.page_content for doc in result["context"]],
            "success": True
        }
        print(f"Sending response data: {response_data}")
        print(f"Response data: {response_data['answer']}")
        
        return response_data
    except Exception as e:
        error_response = {
            "response": f"Sorry, there was an error processing your request: {str(e)}",
            "success": False,
            "error": str(e)
        }
        print(f"Error in chatbot endpoint: {str(e)}")
        return error_response

@app.route('/deploy', methods=['POST'])
def deploy():
    data = request.get_json(force=True)
    print(data)
    network = data.get('network')
    code = data.get('code')
    # Extract contract name from code by finding "mod {name}"
    contract_name = code.split("mod ")[1].split(" ")[0] if "mod " in code else "-error-"
    contract_name = contract_name.strip()
    if contract_name == "-error-":
        print("No contract name found")
        return {"hash": "error"}
    print("Contract name: \"",contract_name,"\"")
    try:
        if code == "":
            raise ValueError("No code provided")
        print("Attempting to deploy contract")
        save_code_to_file(code)
        result = handle_deploy_request(network, contract_name)
        print("Deployment result: ", result)
        return {"hash": result}
    except Exception as e:
        print(f"Error during deployment: {str(e)}")
        return {"hash": "error"}
        

@app.route('/populate', methods=['POST'])
def populate():
    data = request.get_json(force=True)
    prompt = data.get('prompt')
    result = handle_populate_request(prompt)
    return {"result": result}

@app.route('/compile', methods=['POST'])
def compile():
    data = request.get_json(force=True)
    print(data)
    contract_name = data.get('contractName')
    contract_builder = ContractBuilder(data)
    
    # Ensure the src directory exists
    os.makedirs('src', exist_ok=True)
    success = True
    try:
        contract_builder.invoke(contract_name)
        print("Invoke works")
        print("RETURNING COMPILATION SUCCESS")
    except Exception as e:
        print(f"Error during compilation: {str(e)}")
        print("RETURNING COMPILATION FAILURE")
        success = False

    # Always try to read the file, regardless of whether compilation succeeded
    try:
        with open('src/lib.cairo', 'r') as file:
            contract_code = file.read()
        return {"code": contract_code, "success": success}
    except Exception as file_error:
        print(f"Error reading file: {str(file_error)}")
        return {"code": "womp womp", "success": success}

@app.route('/verify', methods=['POST'])
def verify():
    data = request.get_json(force=True)
    code = data.get('code')
    try:
        if code == "":
            raise ValueError("No code provided")
        print("Attempting to verify contract")
        save_code_to_file(code)
        result = handle_verify_request()
        print("Deployment result: ", result)
        return {"success": result}
    except Exception as e:
        print(f"Error during deployment: {str(e)}")
        return {"success": False}

if __name__ == '__main__':
    app.run(debug=True) 