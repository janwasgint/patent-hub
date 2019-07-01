import PatentHub from './../build/contracts/PatentHub.json';
import { deployedAddress } from './const.js';

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [
    // PatentHub
    {
      contractName: 'PatentHub',
      web3Contract: new web3.eth.Contract(PatentHub.abi, deployedAddress)
    }
  ],
  /*events: {
    PatentHub: [
      {
        eventName: 'dataRequestInitiated',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      },
      {
        eventName: 'employeeLegitimises',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      },
      {
        eventName: 'approveContractRequest',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      },
      {
        eventName: 'approveContractResponse',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      },
      {
        eventName: 'updateHA',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      },
      {
        eventName: 'verificationRequest',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      },
      {
        eventName: 'verificationResponse',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      }
    ]
  },*/
  polls: {
    accounts: 1500
  }
};

export default drizzleOptions;
