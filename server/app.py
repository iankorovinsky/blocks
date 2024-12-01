from flask import Flask
from flask_cors import CORS
from agent import invoke
from flask import request


app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/agent')
def agent():
    from agent import handle_agent_request
    return handle_agent_request()

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json(force=True)
    tools = data.get('tools')
    prompt = data.get('prompt')
    return {"response": invoke(tools, prompt)}


# @app.route('/deploy')
# def deploy():
#     data = request.get_json(force=True)
#     network = data.get('network')
#     contract_name = data.get('contract_name')
#     contract_builder = ContractBuilder(data.get('contract_data'))
#     contract_builder.invoke(contract_name)
#     result = handle_deploy_request(network, contract_name)
#     return {"hash": result}

if __name__ == '__main__':
    app.run(debug=True) 