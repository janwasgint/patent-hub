pragma solidity ^0.4.4;

contract Host {

	/// address of the node initializing the contract and managing the identities
	address public host;

	/// registered 3rd parties
	mapping(address => bool) public inventors;
	mapping(address => bool) public patentAgents;
	mapping(address => bool) public drawers;
	mapping(address => bool) public nationalizers;
	mapping(address => bool) public patentOffices;

	constructor() public {
		host = msg.sender;
	}

	/// modifiers 
	modifier onlyHost() {
		require(msg.sender == host);
		_;
	}

    modifier only3rdParty(address actor) {
    	require (
    		isRegisteredAsInventor(actor) ||
    		isRegisteredAsPatentAgent(actor) ||
    		isRegisteredAsDrawer(actor) ||
    		isRegisteredAsNationalizer(actor) ||
    		isRegisteredAsPatentOffice(actor));
    	_;
    }

	/// functions for registering 3rd parties
	function registerInventor(address inventor) public onlyHost {
		inventors[inventor] = true;	
	}

	function registerPatentAgent(address patentAgent) public onlyHost {
		patentAgents[patentAgent] = true;
	}

	function registerDrawer(address drawer) public onlyHost {
		drawers[drawer] = true;
	}

	function registerNationalizer(address nationalizer) public onlyHost {
		nationalizers[nationalizer] = true;
	}

	function registerPatentOffices(address patentOffice) public onlyHost {
		patentOffices[patentOffice] = true;
	}

	/// functions for checking registrations of 3rd parties
	function isRegisteredAsInventor(address inventor) public view returns(bool) {
		return inventors[inventor];
	}

	function isRegisteredAsPatentAgent(address patentAgent) public view returns(bool) {
		return patentAgents[patentAgent];
	}

	function isRegisteredAsDrawer(address drawer) public view returns(bool) {
		return drawers[drawer];
	}

	function isRegisteredAsNationalizer(address nationalizer) public view returns(bool) {
		return nationalizers[nationalizer];
	}

	function isRegisteredAsPatentOffice(address patentOffice) public view returns(bool) {
		return patentOffices[patentOffice];
	}
}