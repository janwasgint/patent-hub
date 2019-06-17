# Node image
FROM node:latest

# Create code directory
RUN mkdir /root/code

# Set working directory
WORKDIR /root/code

# Install Truffle
RUN npm install -g truffle
RUN npm install -g ganache-cli

# For https packages
RUN apt-get update && apt-get install apt-transport-https ca-certificates -y

# For yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn -y

EXPOSE 8545
EXPOSE 3000
EXPOSE 5001
EXPOSE 9984
