from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/agent')
def agent():
    from agent import handle_agent_request
    return handle_agent_request()

@app.route('/deploy')
def deploy():
    from compiler import handle_deploy_request
    return handle_deploy_request()

if __name__ == '__main__':
    app.run(debug=True) 