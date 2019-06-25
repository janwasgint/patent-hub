pragma solidity ^0.4.4;
import "./Host.sol";

/// The patent hub will be hosted by one of the inovators
contract PatentHub is Host {
	// structs
	struct Share {
		address shareholder;
		uint percentage; 		// denoted in values between 0 and 100
		bool accepted; 			// true if the shareholder consented
	}

	struct PatentAgentInventorsContract {
		address patentAgent;
		address[] inventors;
		string ipfsFileHashId;
		bool valid;				// true if all inventors and the patent agent consented
	}

	struct PatentAgentThirdPartyContract {
		address patentAgent;
	}

	// properties
	mapping(address => string[]) contributionFileHashIds;
	Share[] shares;
	bool shareProposalAcceptedByAll;

	PatentAgentInventorsContract patentAgentInventorsContract;
	mapping(address => PatentAgentThirdPartyContract) thirdPartyContracts;

	// events for communication with frontend
	event contributionPhaseFinished(address[] indexed inventors, uint[] indexed shares);
	event contributionListEvent(address indexed inventor, string indexed contributionFileHashIds);

	constructor() public {
		host = msg.sender;
		shareProposalAcceptedByAll = false;
	}

	// functions - share proposal
	function addContribution(string ipfsFileHashId) public onlyInventor(msg.sender) {
		contributionFileHashIds[msg.sender].push(ipfsFileHashId);
	}

	function addShareProposal(address[] inventors, uint[] percentages) public onlyInventor(msg.sender) {
		require(inventors.length == shares.length);
		delete shares;
		for (uint i=0; i<inventors.length; i++) {
            Share memory share = Share(inventors[i], percentages[i], false);
            shares.push(share);
        }
	}

	function getContributions(address inventor) public view returns(string) {
		bool hasAccess = false;
		if (isRegisteredAsInventor(msg.sender)) {
			hasAccess = true;
		}

		require(hasAccess);

		string memory contributionsString = "";
		string[] storage inventorsContributions = contributionFileHashIds[inventor];

		for (uint i=0; i<inventorsContributions.length; i++) {
			contributionsString = strConcat(contributionsString, inventorsContributions[i], "\n");
        }

		return contributionsString;
	}

	function getShare() public view returns(uint) {
		uint share = 0;
		for (uint i=0; i<shares.length; i++) {
			if (shares[i].shareholder == msg.sender) {
				share = shares[i].percentage;
			}
        }
		return share;
	}

	function approveShare() public {
		address[] memory inventors;
		uint[] memory percentages;
		shareProposalAcceptedByAll = true;

		for (uint i=0; i<shares.length; i++) {
			if (shares[i].shareholder == msg.sender) {
				shares[i].accepted = true;
			}
			shareProposalAcceptedByAll = shareProposalAcceptedByAll && shares[i].accepted;
			inventors[i] = shares[i].shareholder;
			percentages[i] = shares[i].percentage;
        }

        if (shareProposalAcceptedByAll) {
        	emit contributionPhaseFinished(inventors, percentages);
        }
	}
}