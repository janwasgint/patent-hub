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

const ipfs_API = require("ipfs-api");
const ipfsApi = ipfs_API("172.16.0.2", "5001", "https");//ipfs_API("localhost", 5001, "https");

const mapNameToAddress = function mapNameToAddress(address) {
  var actorName;
  actorsAndAddress.forEach(actor => {
    if (actor.address.toUpperCase() === address.toUpperCase()) {
      actorName = actor.name;
    }
  });
  return actorName;
};

export { patentAgentAddress, drawerAddress, nationalizerAddress, actorsAndAddress, mapNameToAddress, ipfsApi };
