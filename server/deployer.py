import subprocess
import re
import os
from dotenv import load_dotenv

load_dotenv()

def save_code_to_file(code: str):
    if os.path.exists('src/lib.cairo'):
        os.remove('src/lib.cairo')
    with open('src/lib.cairo', 'w') as file:
        file.write(code)

def handle_deploy_request(network: str, contract_name: str, args: str):
    try:
        env = os.environ.copy()
        if network == 'testnet':
            env['DEPLOYED_NETWORK'] = 'testnet'  # or whatever network you want
            env['RPC_ENDPOINT'] = 'https://free-rpc.nethermind.io/sepolia-juno'
        else:
            env['DEPLOYED_NETWORK'] = 'mainnet'
            env['RPC_ENDPOINT'] = 'https://free-rpc.nethermind.io/mainnet-juno'
        print(f"Running deployer.sh with contract name {contract_name}")
        result = subprocess.run(['bash', './deployer.sh', contract_name, env['KEYSTORE_PASSWORD'], env['DEPLOYED_NETWORK'], env['RPC_ENDPOINT'], args], 
                              capture_output=True, 
                              text=True,
                              check=True,
                              env=env)
        
        # Find the contract address from the output
        match = re.search(r'DEPLOYED_ADDRESS:(0x[a-fA-F0-9]+)', result.stdout)
        if match:
            return match.group(1)  # Returns just the address
        else:
            raise ValueError("Could not find contract address in output")
            
    except subprocess.CalledProcessError as e:
        return f"Deployment failed: {e.stderr}"

def handle_verify_request():
    try:
        result = subprocess.run(['bash', './verifier.sh'], 
                              capture_output=True, 
                              text=True,
                              check=True)
        # Check if output starts with BUILD_ERROR
        if result.stdout.startswith('BUILD_ERROR:'):
            print(f"Verification failed!")
            return False
        else:
            print(f"Verification successful!")
            return True
    except subprocess.CalledProcessError as e:
        print(f"Verification failed!")
        return False