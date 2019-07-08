docker stop ipfs-node && docker rm ipfs-node && echo "IPFS stopped and uninstalled successfully";
docker stop truffle-dev && docker rm truffle-dev && echo "Truffle stopped and uninstalled successfully";
docker network rm blc-dev-env && echo "Network removed successfully\n Done √";
