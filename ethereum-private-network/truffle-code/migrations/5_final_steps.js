var PatentHub = artifacts.require("./PatentHub.sol");
var path = require('path');

module.exports = function(deployer) {
  // Output to console or a configuration file
  // Requiring fs module in which 
  // writeFile function is defined. 
  const fs = require('fs') 
    
  // Data which will write in a file. 
  let data = 
  "const deployedAddress = '" + PatentHub.address  + "';\nconst keyMappings = {\n" +
  "'0x4a927d1c6bc92a672b9fa81d898cafbc775ec8bf': '0x370f78607c70c14732fddff31791ed44bdd1511e552d96b68c9d158a28dd2f0a',\n" +
  "'0x5764e7337dfae66f5ac5551ebb77307709fb0219': '0x620b40dbe275c49b530e71bb6c73cae74c4a350726a9eea3731796a448414d6e',\n" +
  "'0x11c2e86ebecf701c265f6d19036ec90d277dd2b3': '0x822d47ac8fe1eecb3e223f6cb2d99301bbfe4bbde5ab132599a1d55a68277d71',\n" +
  "'0xc33a1d62e6de00d4c9b135718280411101bcb9dd': '0x0fa41039b5b4b807c0443b42a33b82106d0c3ed995adf674983393125b1a4b0a',\n" +
  "'0x01edfe893343e51f89b323c702e21868109bbf1f': '0x6284213496f09d17e3838513a166f44d82eae84819f10d770964d82186c88835',\n" +
  "'0x298bd2bd1aab49b7a8bb0943ab972bd53b084f09': '0x7d9401f9ab930f3c61268d4fa709d1fa04983402151e2dbfcc8269962ead2f27',\n" +
  "'0x95057ead904141f497cdbad7714b295e12f8c48a': '0xea8f33ab18e251c924cc17f3210fa1e49d4ef51379aed78026d5bd46d93eaff4',\n" +
  "'0xf11e2da93e64f102016b44bab37d1166a497cf8a': '0x98b2bf25a3dccdfe9adce99b9ae3ff56f86b52159122f2a87ae2ed754380a432',\n" +
  "'0x9956e0c61ba9051595316edf19dd5e699ca0fa91': '0x523b96e31e46d286d5e6ca33e286b1954afa51aceb2676a8332319bf25c3044f',\n" +
  "'0xec6b9b45b15289c572a6cbbf572d5e4e5bd30c97': '0xe1d01b5ca41fb1281eff203f151b9b769dcf7eb2304fc55505fdf0c55d368367'\n" +
  "};\n" +
  "\n" +
  "export { deployedAddress, keyMappings };"

  // Write data
  fs.writeFile(path.join(__dirname, '../src/const.js'), data, (err) => {
      if (err) throw 'Error writing file: ' + err;
  });
};
