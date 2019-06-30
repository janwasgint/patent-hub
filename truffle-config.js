module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  },
  compilers: {
    solc: {
      version: "0.5.2" // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
  }
};