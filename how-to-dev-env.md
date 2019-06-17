  # Static Network Configuration
  The subnet is going to be configured on the ipfs container, the bcdb container and the ethereum private network container, which will allow them to communicate with eachother. Run the following command to create the docker subnet:
   
  * `docker network create --subnet=172.16.0.0/24 blc-dev-env`

# Hyperledger-Fabric & Composer

  Go through the following tutorials to configure the Fabric&Composer environment and to build a demo Fabric network:

  * https://hyperledger-fabric.readthedocs.io/en/latest/getting_started.html
  * https://hyperledger.github.io/composer/latest/installing/installing-prereqs.html
  * https://hyperledger.github.io/composer/latest/installing/development-tools.html

  **Note**: If you get a `connection timeout error` while executing `startFabric.sh`, please set the environment variable `FABRIC_START_TIMEOUT=30`, or to a larger value, if it still fails


# Ethereum

  We are going to use a Dockerized ethereum private network using Ganache with a set of predefined accounts. As a ethereum development framework we are going to use Truffle.

  In order to configure the ethereum private blockchain container, execute the following commands:

  ```
  cd ./ethereum-private-network
  docker-compose up -d
  ```

  Attach to the container and execute the following command in order to initialize the private blockchain which needs to listen on any host, since there will be requests coming from outside the docker container:
  
  ```
  ganache-cli -d -h 0.0.0.0 -m "raven shock define wish brown cloth twin win weasel stable tone share"
  ```
  
  Ganache Available Accounts:
  ```
  (0) 0x4a927d1c6bc92a672b9fa81d898cafbc775ec8bf
  (1) 0x5764e7337dfae66f5ac5551ebb77307709fb0219
  (2) 0x11c2e86ebecf701c265f6d19036ec90d277dd2b3
  (3) 0xc33a1d62e6de00d4c9b135718280411101bcb9dd
  (4) 0x01edfe893343e51f89b323c702e21868109bbf1f
  (5) 0x298bd2bd1aab49b7a8bb0943ab972bd53b084f09
  (6) 0x95057ead904141f497cdbad7714b295e12f8c48a
  (7) 0xf11e2da93e64f102016b44bab37d1166a497cf8a
  (8) 0x9956e0c61ba9051595316edf19dd5e699ca0fa91
  (9) 0xec6b9b45b15289c572a6cbbf572d5e4e5bd30c97
  ```

  Ganache Private Keys:
  ```
  (0) 370f78607c70c14732fddff31791ed44bdd1511e552d96b68c9d158a28dd2f0a
  (1) 620b40dbe275c49b530e71bb6c73cae74c4a350726a9eea3731796a448414d6e
  (2) 822d47ac8fe1eecb3e223f6cb2d99301bbfe4bbde5ab132599a1d55a68277d71
  (3) 0fa41039b5b4b807c0443b42a33b82106d0c3ed995adf674983393125b1a4b0a
  (4) 6284213496f09d17e3838513a166f44d82eae84819f10d770964d82186c88835
  (5) 7d9401f9ab930f3c61268d4fa709d1fa04983402151e2dbfcc8269962ead2f27
  (6) ea8f33ab18e251c924cc17f3210fa1e49d4ef51379aed78026d5bd46d93eaff4
  (7) 98b2bf25a3dccdfe9adce99b9ae3ff56f86b52159122f2a87ae2ed754380a432
  (8) 523b96e31e46d286d5e6ca33e286b1954afa51aceb2676a8332319bf25c3044f
  (9) e1d01b5ca41fb1281eff203f151b9b769dcf7eb2304fc55505fdf0c55d368367
  ```

  You can use `MetaMask` to connect to the first account configured by `Ganache`. In MetaMask click on top left and switch network to `Localhost 8545`. In MetaMask restore from seed pharase wih: raven shock define wish brown cloth twin win weasel stable tone share

  A directory called `truffle-code` was created by `docker` which represents a volume that is mapped inside the `truffle-dev` container to `/root/code`.
  This should make the development of your smart contracts isolated from any technologies needed to compile and deploy the smart contracts, such as `truffle`.
  All the `truffle` commands should be run inside the docker container, while you can use your favourite text editor to write and edit source code within the `truffle-code` folder. **NOTE**: You might need to change the owner of the files in the `truffle-code` directory on the host, since the user in the guest is `root` and, therefore, any command executed in the guest (such as `truffle` related commands) might change the permission of the affected files to root.

  For a comprehensive `truffle` tutorial please check: https://truffleframework.com/docs/truffle/overview
  After initializing your `truffle` project, edit the `truffle-config.json` file to configure `truffle` to connect to your private Ethereum blockchain.
  For the current docker setup, the file should look similar to:
  ```
  module.exports = {
    networks: {
      development: {
        host: "172.16.0.4",
        port: 8545,
        network_id: "*"
      }
    }
  };

  ```

# IPFS

  Execute following commands to run an `IPFS` node in a docker container:

  ```
  cd <path-to-blockchain-dev-env>/ipfs
  ./start.sh
  ```

  When developing your dapp, consider that the IPFS node is running in a docker container with the following static IP: `172.16.0.2`

  Go through the following tutorial to better understand the arguments of the `start.sh` script:

  https://blog.ipfs.io/1-run-ipfs-on-docker/

  A demo NodeJS script has been provided in `demos/ipfs-nodejs` that creates a file on the local FS, adds it into IPFS using the http gateway provided by the IPFS docker container and then tries to get the same file from IPFS and print its contents. In order to be able to run the script, you need to install the IPFS NodeJS client first:
  ```
  npm install ipfs-http-client
  ```

  In order to run the demo, execute the following:
  ```
  cd demos/ipfs-nodejs
  node demo.js
  ```


# BigchainDB

  Execute following commands to run a `BCDB` node in a docker container:

  ```
  cd <path-to-blockchain-dev-env>/bigchaindb
  ./start.sh
  ```

  When developing your dapp, consider that the IPFS node is running in a docker container with the following static IP: `172.16.0.3`

  Go through the following tutorial to better understand the arguments of the `start.sh` script:

  * http://docs.bigchaindb.com/projects/server/en/v2.0.0b9/appendices/all-in-one-bigchaindb.html

  A demo NodeJS script has been provided in `demos/bcdb-nodejs` that instantiates a new BCDB mnemonic and creates a transaction with an asset and metadata using the API port bound to the BCDB docker container. In order to be able to run the script, you need to install the BCDB NodeJS driver first:
  ```
  npm install bigchaindb-driver
  ```

  **NOTE**: In case you get an error **Error: Cannot find module bigchaindb-driver**, there is an open issue with bigchaindb-driver version 4.1.1. 
  
  Install an older version of bigchaindb-driver, e.g 4.0.0 and it should work.
 
  In order to run the demo, execute the following (if errors, look at the **NOTE** below):
  ```
  cd demos/bcdb-nodejs
  node demo.js
  ```

  **NOTE** If you get an error similar to:
  ```
  /home/ap1/Workspace/node_modules/base-x/index.js:29
    if (!Buffer.isBuffer(source)) throw new TypeError('Expected Buffer')
                                  ^

    TypeError: Expected Buffer
    at Object.encode (<path_to_node_modules>/node_modules/base-x/index.js:29:41)
    at new Ed25519Keypair (<path_to_node_modules>/bigchaindb-driver/dist/node/Ed25519Keypair.js:28:33)
    at Object.<anonymous> (<path_to_blockchain_dev_env>/demos/bcdb-nodejs/demo.js:7:15)
    at Module._compile (module.js:653:30)
    at Object.Module._extensions..js (module.js:664:10)
    at Module.load (module.js:566:32)
    at tryModuleLoad (module.js:506:12)
    at Function.Module._load (module.js:498:3)
    at Function.Module.runMain (module.js:694:10)
    at startup (bootstrap_node.js:204:16)
  ```

  Then you need to edit `<path_to_node_modules>/bigchaindb-driver/dist/node/Ed25519Keypair.js` and add the following:
  ```
  this.publicKey = _bs2.default.encode(Buffer.from(keyPair.publicKey));
  this.privateKey = _bs2.default.encode(Buffer.from(keyPair.secretKey.slice(0, 32)));
  ```
  
  # Advanced demos
  
  For more advanced demos please see the following projects: 
  * https://git.fortiss.org/Blockchain/student-practical-courses/blc4pi-ss2018/rental-nomad
  * https://git.fortiss.org/Blockchain/student-practical-courses/blc4pi-ss2018/auditchain
  
  #  License
  This project is licensed under the Apache License, Version 2.0  - see the [LICENSE](LICENSE) file for details
