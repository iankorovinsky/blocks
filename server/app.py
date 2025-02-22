from flask import Flask
from flask_cors import CORS
from agent import invoke
from flask import request

from deployer import handle_deploy_request
import os
from flask import request
from contract_builder import ContractBuilder

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": "*"}})

@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/agent')
def agent():
    return handle_agent_request()

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json(force=True)
    tools = data.get('tools')
    prompt = data.get('prompt')
    return {"response": invoke(tools, prompt)}

@app.route('/deploy', methods=['POST'])
def deploy():
    data = request.get_json(force=True)
    print(data)
    network = data.get('network')
    contract_name = data.get('contract_name')
    contract_builder = ContractBuilder(data)
    try:
        # contract_builder.jsonData = data
        contract_path = contract_builder.invoke(contract_name)
        print("Done invoking contract builder")
        result = handle_deploy_request(network, contract_name, contract_path)
        return {"hash": result}
    except Exception as e:
        contract_name = "SimpleContract"
        data = 'sample4.json'
        contract_builder = ContractBuilder({})
        contract_builder.jsonData = contract_builder.loadJson(data)
        print(f"HIIIIIII: {contract_name}")
        contract_path = contract_builder.invoke(contract_name)
        print("Done invoking contract builder")
        result = handle_deploy_request(network, contract_name, contract_path)
        print("TRIGGERED EXCEPTION")
        return {"hash": result}
        

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
    contract_name = data.get('contract_name')
    contract_builder = ContractBuilder(data)
    
    # Ensure the src directory exists
    os.makedirs('src', exist_ok=True)
    
    try:
        contract_builder.invoke(contract_name)
        print("Invoke works")
    except Exception as e:
        print(f"Error during compilation: {str(e)}")

    # Always try to read the file, regardless of whether compilation succeeded
    try:
        with open('src/lib.cairo', 'r') as file:
            contract_code = file.read()
        return {"code": contract_code}
    except Exception as file_error:
        print(f"Error reading file: {str(file_error)}")
        return {"code": "// Error: Could not read contract file"}

if __name__ == '__main__':
    app.run(debug=True) 