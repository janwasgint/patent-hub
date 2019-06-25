pragma solidity ^0.5.2;
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
	    // contribution phase
	mapping(address => string[]) contributionFileHashIds;
	Share[] shares;
	bool shareProposalAcceptedByAll;

        // patent agent contracting phase
	PatentAgentInventorsContract patentAgentInventorsContract;
	mapping(address => PatentAgentThirdPartyContract) thirdPartyContracts;


	// events for communication with frontend
	event contributionPhaseFinished();

	constructor() public {
		host = msg.sender;
		shareProposalAcceptedByAll = false;
	}

	// functions - share proposal
	function addContribution(string memory ipfsFileHashId) public onlyInventor(msg.sender) {
		contributionFileHashIds[msg.sender].push(ipfsFileHashId);
	}

	function addSharesProposal(address[] memory inventors, uint[] memory percentages) public onlyInventor(msg.sender) {
	    require(inventors.length == percentages.length);
	    
	    // check whether all inventors are included in the shares porposal
		for (uint i=0; i<allInventors.length; i++) {
		    bool isIncluded = false;
		    
		    for (uint j=0; j<inventors.length; j++) {
		        if (allInventors[i] == inventors[j]) {
		            isIncluded = true;
		        }
		    }
		    
		    require(isIncluded);
		}
	    
	    // check whether percentages amount to 100
	    uint sum = 0;
	    for (uint i=0; i<percentages.length; i++) {
            sum += percentages[i];
        }
        require(sum == 100);
	   
	    // store the shares
		delete shares;
		for (uint i=0; i<inventors.length; i++) {
            Share memory share = Share(inventors[i], percentages[i], false);
            shares.push(share);
        }
	}

	function getContributions(address inventor) public view returns(string memory) {
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

	function approveShare() public onlyInventor(msg.sender) {
		shareProposalAcceptedByAll = true;

		for (uint i=0; i<shares.length; i++) {
			if (shares[i].shareholder == msg.sender) {
				shares[i].accepted = true;
			}
			shareProposalAcceptedByAll = shareProposalAcceptedByAll && shares[i].accepted;
        }

        if (shareProposalAcceptedByAll) {
        	emit contributionPhaseFinished();
        }
	}
	
	function sharesAcceptedByAllInventors() public view returns(bool) {
	    return shareProposalAcceptedByAll;
	}
}