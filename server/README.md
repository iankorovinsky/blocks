To contribute to the server:

Setup the Starknet Foundation docker image for local development: https://hub.docker.com/repository/docker/starknetfoundation/starknet-dev/general

```
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Hit the appropriate endpoint as seen fit.

`./deployer.sh` will deploy the smart contracts.

`scarb build` will check if the contracts compile.
