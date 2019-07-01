pragma solidity ^0.5.2;
import "./Helper.sol";

contract Host is Helper {

	/// address of the node initializing the contract and managing the identities
	address public host;

	/// registered 3rd parties
	mapping(address => bool) public inventors;
	address[] public allInventors;
	mapping(address => bool) public patentAgents;
	mapping(address => bool) public drawers;
	mapping(address => bool) public nationalizers;
	mapping(address => bool) public translators;
	mapping(address => bool) public patentOffices;

	/// modifiers 
	modifier onlyHost() {
		require(msg.sender == host);
		_;
	}

	modifier onlyInventor(address inventor) {
		require (isRegisteredAsInventor(inventor));
		_;
	}

	modifier onlyPatentAgent(address patentAgent) {
		require (isRegisteredAsPatentAgent(patentAgent));
		_;
	}
	
	modifier onlyPatentOffice(address patentOffice) {
	    require (isRegisteredAsPatentOffice(patentOffice));
	    _;
	}

    modifier only3rdParty(address actor) {
    	require (
    		isRegisteredAsInventor(actor) ||
    		isRegisteredAsPatentAgent(actor) ||
    		isRegisteredAsDrawer(actor) ||
    		isRegisteredAsNationalizer(actor) ||
    		isRegisteredAsTranslator(actor) ||
    		isRegisteredAsPatentOffice(actor));
    	_;
    }

	/// functions for registering 3rd parties
	function registerInventor(address inventor) public onlyHost {
	    if (inventors[inventor] == false) {
	        allInventors.push(inventor);
	    }
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

    function registerTranslator(address translator) public onlyHost {
		translators[translator] = true;
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

    function isRegisteredAsTranslator(address translator) public view returns(bool) {
		return translators[translator];
	}

	function isRegisteredAsPatentOffice(address patentOffice) public view returns(bool) {
		return patentOffices[patentOffice];
	}
}
