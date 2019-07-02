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

	modifier onlyInventor() {
		require (isRegisteredAsInventor(msg.sender));
		_;
	}

	modifier onlyPatentAgent() {
		require (isRegisteredAsPatentAgent(msg.sender));
		_;
	}
	
	modifier onlyPatentOffice() {
	    require (isRegisteredAsPatentOffice(msg.sender));
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


    // events
        // setup phase
	            // when a participant is registered by the host
    event participantRegistered(address indexed participant, string role);


	/// functions for registering 3rd parties
	function registerInventor(address inventor) public onlyHost {
	    if (inventors[inventor] == false) {
	        allInventors.push(inventor);
	    }
		inventors[inventor] = true;
        emit participantRegistered(inventor, "Inventor");
	}

	function registerPatentAgent(address patentAgent) public onlyHost {
		patentAgents[patentAgent] = true;
        emit participantRegistered(patentAgent, "Patent Agent");
	}

	function registerDrawer(address drawer) public onlyHost {
		drawers[drawer] = true;
        emit participantRegistered(drawer, "Drawer");
	}

	function registerNationalizer(address nationalizer) public onlyHost {
		nationalizers[nationalizer] = true;
        emit participantRegistered(nationalizer, "Nationalizer");
	}

    function registerTranslator(address translator) public onlyHost {
		translators[translator] = true;
        emit participantRegistered(translator, "Translator");
    }

	function registerPatentOffice(address patentOffice) public onlyHost {
		patentOffices[patentOffice] = true;
        emit participantRegistered(patentOffice, "Patent Office");
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
