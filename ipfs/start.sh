#!/bin/bash

mkdir -p ~/ipfs-docker-data/
mkdir -p ~/ipfs-docker-staging/

docker run -d --name ipfs-node \
  --net blc-dev-env --ip 172.16.0.2 \
  -v ~/ipfs-docker-staging:/export -v ~/ipfs-docker-data:/data/ipfs \
  -p 8080:8080 -p 4001:4001 -p 5001:5001 \
  ipfs/go-ipfs:latest

sleep 5
docker exec ipfs-node ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
docker exec ipfs-node ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
docker exec ipfs-node ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
docker exec ipfs-node ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
docker exec ipfs-node ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
