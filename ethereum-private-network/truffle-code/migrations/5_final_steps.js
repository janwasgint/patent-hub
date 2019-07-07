var PatentHub = artifacts.require("./PatentHub.sol");
var path = require('path');

module.exports = function(deployer) {
  const fs = require('fs') 
    
  let data = 
  "const deployedAddress = '" + PatentHub.address  + "';\n" +
  "export { deployedAddress };"

  // Write data
  fs.writeFile(path.join(__dirname, '../src/const.js'), data, (err) => {
      if (err) throw 'Error writing file: ' + err;
  });
};
