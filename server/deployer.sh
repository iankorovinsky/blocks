#!/bin/bash

# Check if both arguments are provided
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Error: Both contract name and password arguments are required"
    echo "Usage: ./deployer.sh <contract_name> <password>"
    exit 1
fi

CONTRACT_NAME="$1"
PASSWORD="$2"
DEPLOYED_NETWORK="${DEPLOYED_NETWORK:-testnet}"  # Default to testnet if not set
RPC_ENDPOINT="${RPC_ENDPOINT:-https://free-rpc.nethermind.io/sepolia-juno}"  # Default RPC if not set

# 1. Delete everything in src/target/dev
rm -rf src/target/dev/*

# 2. Assert directory is empty
if [ "$(ls -A src/target/dev 2>/dev/null)" ]; then
    echo "Error: src/target/dev is not empty"
    exit 1
fi

# 3. Run scarb build and wait for files
scarb build

# Wait for files to appear in target/dev
while [ $(ls target/dev | wc -l) -lt 3 ]; do
    sleep 1
done

# Create expect script for declare
cat << EOF > declare.exp
#!/usr/bin/expect -f
spawn starkli declare target/dev/sample_contract_${CONTRACT_NAME}.contract_class.json --rpc ${RPC_ENDPOINT} --account account_${DEPLOYED_NETWORK}_ian_account.json --keystore account_${DEPLOYED_NETWORK}_ian_keystore.json
expect "Enter keystore password:"
send "${PASSWORD}\r"
expect eof
EOF

chmod +x declare.exp

# Run declare and capture output with better parsing
declare_output=$(./declare.exp)
class_hash=$(echo "$declare_output" | grep -o '0x[0-9a-fA-F]\+' | tail -n 1)

if [ -z "$class_hash" ]; then
    echo "Error: Failed to extract class hash from declare output"
    exit 1
fi

echo "Successfully declared class hash: $class_hash"

# Create deploy expect script with proper quoting
cat << EOF > deploy.exp
#!/usr/bin/expect -f
spawn starkli deploy "$class_hash" --rpc ${RPC_ENDPOINT} --account account_${DEPLOYED_NETWORK}_ian_account.json --keystore account_${DEPLOYED_NETWORK}_ian_keystore.json
expect "Enter keystore password:"
send "${PASSWORD}\r"
expect eof
EOF

chmod +x deploy.exp

# Run deploy with better output parsing
deploy_output=$(./deploy.exp)
contract_address=$(echo "$deploy_output" | grep -o '0x[0-9a-fA-F]\+' | tail -n 1)

if [ -z "$contract_address" ]; then
    echo "Error: Failed to extract contract address from deploy output"
    exit 1
fi

# Add this special line for subprocess parsing
echo "DEPLOYED_ADDRESS:$contract_address"

echo "Contract successfully deployed: $contract_address"
echo "$(date '+%Y-%m-%d %H:%M:%S') - $contract_address" >> deployed_contracts.txt

# Cleanup
rm declare.exp deploy.exp