To run the server:

`bash ./run.sh`

To deploy a contract, you need to hit the /deploy endpoint with the network, contract_name, and other contract compilation parameters

To invoke a function in a smart contract, you need:

```
starkli invoke <HASH> agent 5 --rpc https://free-rpc.nethermind.io/sepolia-juno --account account_testnet_ian_account.json --keystore account_testnet_ian_keystore.json
```

Make sure you've setup the appropriate keystores using this tutorial: https://medium.com/@mr.evans0075/how-to-deploy-starknet-contracts-on-testnet-or-mainnet-2177fb34c64e

starkli invoke 0x07854919a55557814b001c0f77a14d3a1ecc17f67ecc6088a36cab944d60a0cb agent "This is a test" --rpc https://free-rpc.nethermind.io/sepolia-juno --account account_testnet_ian_account.json --keystore account_testnet_ian_keystore.json

starkli invoke 0x07854919a55557814b001c0f77a14d3a1ecc17f67ecc6088a36cab944d60a0cb agent 1 149135661426535105038297483261728626505585133758534573706488366727222552947 596521303608245187183 9 --rpc https://free-rpc.nethermind.io/sepolia-juno --account account_testnet_ian_account.json --keystore account_testnet_ian_keystore.json