const patentAgentAddress = "0x01edfe893343e51f89b323c702e21868109bbf1f";
const drawerAddress = "0x298bd2bd1aab49b7a8bb0943ab972bd53b084f09";
const nationalizerAddress = "0x95057ead904141f497cdbad7714b295e12f8c48a";

const actorsAndAddress = [
  { address: "0x5764e7337dfae66f5ac5551ebb77307709fb0219", name: "Jan" },
  { address: "0x11c2e86ebecf701c265f6d19036ec90d277dd2b3", name: "Luca" },
  { address: "0xc33a1d62e6de00d4c9b135718280411101bcb9dd", name: "Korbi" },
  { address: "0x01edfe893343e51f89b323c702e21868109bbf1f", name: "Goofy" },
  { address: "0x298bd2bd1aab49b7a8bb0943ab972bd53b084f09", name: "Donald" },
  { address: "0x95057ead904141f497cdbad7714b295e12f8c48a", name: "Mickey" }
];

const actorsAndRoles = {
  "0x4a927d1c6bc92a672b9fa81d898cafbc775ec8bf": "Host",
  "0x5764e7337dfae66f5ac5551ebb77307709fb0219": "Inventor",
  "0x11c2e86ebecf701c265f6d19036ec90d277dd2b3": "Inventor",
  "0xc33a1d62e6de00d4c9b135718280411101bcb9dd": "Inventor",
  "0x01edfe893343e51f89b323c702e21868109bbf1f": "Patent Agent",
  "0x298bd2bd1aab49b7a8bb0943ab972bd53b084f09": "Drawer",
  "0x95057ead904141f497cdbad7714b295e12f8c48a": "Nationalizer",
  "0xf11e2da93e64f102016b44bab37d1166a497cf8a": "Patent Office"
};

const IPFS_API = require("ipfs-api");


// ---------------------------------------------------------------------------------------
// For DOCKER CONTAINER IPFS use:
const ipfsApi = IPFS_API("172.16.0.2", 5001, "https");
// For LOCALHOST IPFS use:
// const ipfsApi = IPFS_API("localhost", 5001, "https");
// ---------------------------------------------------------------------------------------
// Comment out the respective other line.
// ---------------------------------------------------------------------------------------


const alertEnabled = false;

const mapNameToAddress = function mapNameToAddress(address) {
  var actorName;
  actorsAndAddress.forEach(actor => {
    if (actor.address.toUpperCase() === address.toUpperCase()) {
      actorName = actor.name;
    }
  });
  return actorName;
};

const downloadPdf = function downloadPdf(ipfsFileHash) {
  ipfsApi.get(ipfsFileHash, function(err, files) {
    files.forEach(file => {
      console.log(file.path);
      console.log(file.content.toString("utf8"));
    });
  });
};

export {
  patentAgentAddress,
  drawerAddress,
  nationalizerAddress,
  actorsAndAddress,
  actorsAndRoles,
  mapNameToAddress,
  ipfsApi,
  downloadPdf,
  alertEnabled
};
