import PatentHub from './../../build/contracts/PatentHub.json';

var getContract = function(drizzle) {
  var contract = require('truffle-contract');
  var MyContract = contract({
    abi: PatentHub.abi
  });
  console.log(drizzle.web3.givenProvider);
  MyContract.setProvider(drizzle.web3.givenProvider);

  return MyContract.at(drizzle.contracts.PatentHub.address);
};

export { getContract };
