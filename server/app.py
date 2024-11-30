from flask import Flask
from flask_cors import CORS
from deployer import handle_deploy_request
from agent import handle_agent_request
import os
from flask import request


app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/agent')
def agent():
    return handle_agent_request()

@app.route('/deploy', methods=['POST'])
def deploy():
    data = request.get_json(force=True)
    network = data.get('network')
    contract_name = data.get('contract_name')
    result = handle_deploy_request(network, contract_name)
    return {"hash": result}

if __name__ == '__main__':
    app.run(debug=True) 