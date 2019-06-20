pragma solidity ^0.4.4;
import "./Host.sol";

contract PatentHub is Host {

	// structs
	struct Contribution {
		address contributor;
		string ipfsFileHashId;
	}

	struct Share {
		address shareholder;
		uint percentage; // denoted in values between 0 and 100
	}

	struct ParticipationProposal {
		bytes32[] sharesKeys;
		mapping(bytes32 => Answer) shares;
		bool valid;
	}

	constructor() public {
		host = msg.sender;
	}

	// events
	event 

	mapping()
}