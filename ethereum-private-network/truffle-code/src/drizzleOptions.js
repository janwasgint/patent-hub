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
  events: {
    PatentHub: [
      {
        eventName: 'participantRegistered',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      },
      {
        eventName: 'contributionAddedSuccessfully',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      },
      {
        eventName: 'sharesProposalSubmitted',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      },
      {
        eventName: 'contributionPhaseFinished',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      },
      {
        eventName: 'approvePatentAgentContractRequest',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      },
      {
        eventName: 'patentAgentInventorsContractApproved',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      },
      {
        eventName: 'patentDraftUpdated',
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
        eventName: 'contractApproved',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      },
      {
        eventName: 'feePaid',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      },
      {
        eventName: 'nationalPatentAccepted',
        eventOptions: {
          fromBlock: 0,
          toBlock: 'latest'
        }
      }
    ]
  },
  polls: {
    accounts: 1500
  }
};

export default drizzleOptions;
