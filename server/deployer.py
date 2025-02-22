import subprocess
import re
import os
from dotenv import load_dotenv

load_dotenv()

def handle_deploy_request(network: str, contract_name: str, contract_path: str):
    try:
        print(f"Deploying contract from {contract_path}")
        env = os.environ.copy()
        if network == 'testnet':
            env['DEPLOYED_NETWORK'] = 'testnet'  # or whatever network you want
            env['RPC_ENDPOINT'] = 'https://free-rpc.nethermind.io/sepolia-juno'
        else:
            env['DEPLOYED_NETWORK'] = 'mainnet'
            env['RPC_ENDPOINT'] = 'https://free-rpc.nethermind.io/mainnet-juno'
        print(f"Running deployer.sh with contract name {contract_name}")
        result = subprocess.run(['bash', './deployer.sh', contract_name, env['KEYSTORE_PASSWORD'], env['DEPLOYED_NETWORK'], env['RPC_ENDPOINT']], 
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