# Patent Hub

Facilitating the process from idea to filed patent by maintaining an unforgeable document history and handling payments using DLTs.

---------------------------------------------------------------------------------------------------------

## Requirements

*   Docker

*   MetaMask

---------------------------------------------------------------------------------------------------------

## Install

```
docker network create --subnet=172.16.0.0/24 blc-dev-env

sh ipfs/start.sh

cd ethereum-private-network/

docker-compose up -d

cd truffle-code

docker exec truffle-dev yarn install
```

---------------------------------------------------------------------------------------------------------

## Compile and run

`docker exec -it truffle-dev bash` to attach a new terminal to the container.

```
ganache-cli -d -h 0.0.0.0 -m "raven shock define wish brown cloth twin win weasel stable tone share"

truffle compile && truffle migrate
```

Log in to MetaMask and restore the account with the seed phrase.
Change privacy settings: Settings -> Security & Privacy -> Untoggle Privacy mode

`yarn start` and type *http://localhost:3000/* in your browser to connect.

---------------------------------------------------------------------------------------------------------

## Available accounts

Host:          + 0x4a927d1c6bc92a672b9fa81d898cafbc775ec8bf (~100 ETH)\
Inventor 1:    0x5764e7337dfae66f5ac5551ebb77307709fb0219 (~100 ETH)\
Inventor 2:    0x11c2e86ebecf701c265f6d19036ec90d277dd2b3 (~100 ETH)\
Inventor 3:    0xc33a1d62e6de00d4c9b135718280411101bcb9dd (~100 ETH)\
Patent Agent:  0x01edfe893343e51f89b323c702e21868109bbf1f (~100 ETH)\
Drawer:        0x298bd2bd1aab49b7a8bb0943ab972bd53b084f09 (~100 ETH)\
Nationalizer:  0x95057ead904141f497cdbad7714b295e12f8c48a (~100 ETH)\
Patent Office: 0xf11e2da93e64f102016b44bab37d1166a497cf8a (~100 ETH)\

Unregistered 1: 0x9956e0c61ba9051595316edf19dd5e699ca0fa91 (~100 ETH)\
Unregistered 2: 0xec6b9b45b15289c572a6cbbf572d5e4e5bd30c97 (~100 ETH)\

---------------------------------------------------------------------------------------------------------

## Stop

```
docker stop ipfs-node

docker stop truffle-dev
```

---------------------------------------------------------------------------------------------------------

## Uninstall

```
docker rm ipfs-node 

docker rm truffle-dev 

docker network rm blc-dev-env
```

---------------------------------------------------------------------------------------------------------
