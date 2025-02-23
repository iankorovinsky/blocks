#!/bin/bash

# Check if both arguments are provided
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
    echo "Error: Contract name, password, network, and rpc endpoint arguments are required"
    echo "Usage: ./deployer.sh <contract_name> <password> <network> <rpc_endpoint>"
    exit 1
fi

CONTRACT_NAME="$1"
PASSWORD="$2"
DEPLOYED_NETWORK="$3"
RPC_ENDPOINT="$4"

echo "Deleting everything in target/dev"

# 1. Delete everything in target/dev
rm -rf target/dev/*

echo "Asserting deletion succeeded"

# 2. Assert directory is empty
if [ "$(ls -A target/dev 2>/dev/null)" ]; then
    echo "Error: target/dev is not empty"
    exit 1
fi

echo "Moving into directory"

echo "Current directory: $(pwd)\nBuilding contract"

# 3. Run scarb build and wait for files
scarb build

echo "Waiting for files to appear in target/dev"

# Wait for files to appear in target/dev
while [ $(ls target/dev | wc -l) -lt 3 ]; do
    sleep 1
done

echo "Files appeared in target/dev\nDeclaring contract"

# Run declare command directly with password
echo "Running declare"

# Create declare expect script
cat << EOF > declare.exp
#!/usr/bin/expect -f
spawn starkli declare target/dev/sample_contract_${CONTRACT_NAME}.contract_class.json --rpc ${RPC_ENDPOINT} --account account_${DEPLOYED_NETWORK}_ian_account.json --keystore account_${DEPLOYED_NETWORK}_ian_keystore.json --fee-token STRK
expect "Enter keystore password:"
send "${PASSWORD}\r"
expect eof
EOF

chmod +x declare.exp

# Run declare with output parsing
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