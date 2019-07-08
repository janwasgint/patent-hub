# Patent Hub

Ethereum Dapp to facilitate the process of patent creation by maintaining an unforgeable document history and handling payments through the blockchain.

---------------------------------------------------------------------------------------------------------

## Requirements

*   docker (version >= 18.09.5)

*   MetaMask (version >= 6.7.2)

*   yarn (version >= 1.16.0)

---------------------------------------------------------------------------------------------------------

## Docker setup

Run the following commands in the root directory:

```
docker network create --subnet=172.16.0.0/24 blc-dev-env

cd ethereum-private-network/

docker-compose up -d

docker exec truffle-dev yarn install
```

---------------------------------------------------------------------------------------------------------

## IPFS setup

You can run IPFS either in a container or in the localhost.

#### Container

Open */ethereum-private-network/truffle-code/src/components/shared.js*
Find the comment `For DOCKER CONTAINER IPFS use:`.
Make sure the line below is _not_ commented out.
Find the comment `For LOCALHOST IPFS use:`.
Make sure the line below _is_ commented out.

In the root directory run `sh ipfs/start.sh`.

#### Localhost

Open */ethereum-private-network/truffle-code/src/components/shared.js*
Find the comment `For DOCKER CONTAINER IPFS use:`.
Make sure the line below _is_ commented out.
Find the comment `For LOCALHOST IPFS use:`.
Make sure the line below is _not_ commented out.

Install IPFS and run the following commands:
```
ipfs init

ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001

ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'

ipfs daemon
```

---------------------------------------------------------------------------------------------------------

## Compile and run

`docker exec -it truffle-dev bash` to attach a new terminal to the container.

Attach a terminal to the container and run:
```
ganache-cli -d -h 0.0.0.0 -m "raven shock define wish brown cloth twin win weasel stable tone share"
```

Log in to MetaMask and restore the account with the seed phrase.  
Change privacy settings: Settings -> Security & Privacy -> Untoggle Privacy mode

Attach a new terminal to the container and run:
```
truffle compile && truffle migrate

yarn start
```
Type *http://localhost:3000/* in your browser to connect to the application.

---------------------------------------------------------------------------------------------------------

## Available accounts

Host:          0x4a927d1c6bc92a672b9fa81d898cafbc775ec8bf (~100 ETH)  
Inventor:      0x5764e7337dfae66f5ac5551ebb77307709fb0219 (~100 ETH)  
Inventor:      0x11c2e86ebecf701c265f6d19036ec90d277dd2b3 (~100 ETH)  
Inventor:      0xc33a1d62e6de00d4c9b135718280411101bcb9dd (~100 ETH)  
Patent Agent:  0x01edfe893343e51f89b323c702e21868109bbf1f (~100 ETH)  
Drawer:        0x298bd2bd1aab49b7a8bb0943ab972bd53b084f09 (~100 ETH)  
Nationalizer:  0x95057ead904141f497cdbad7714b295e12f8c48a (~100 ETH)  
Patent Office: 0xf11e2da93e64f102016b44bab37d1166a497cf8a (~100 ETH)  

Unregistered:  0x9956e0c61ba9051595316edf19dd5e699ca0fa91 (~100 ETH)  
Unregistered:  0xec6b9b45b15289c572a6cbbf572d5e4e5bd30c97 (~100 ETH)  

---------------------------------------------------------------------------------------------------------

## Stop docker containers

```
docker stop ipfs-node

docker stop truffle-dev
```

---------------------------------------------------------------------------------------------------------

## Remove docker containers

```
docker rm ipfs-node

docker rm truffle-dev

docker network rm blc-dev-env
```

---------------------------------------------------------------------------------------------------------
