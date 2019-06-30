pragma solidity ^0.5.2;
import "./Host.sol";

/// The patent hub will be hosted by one of the inovators
contract PatentHub is Host {
    
    
	// structs
		// contribution phase
	struct Share {
		address shareholder;
		uint percentage; 		// denoted in values between 0 and 100
		bool accepted; 			// true if the shareholder consented
	}

		// patent agent contracting phase
	struct PatentAgentInventorContract {
		address patentAgent;
		string ipfsFileHash;
		uint payment;
		mapping(address => bool) inventorsConsent;
        bool signed;
	}
	
	    // patent draft and third party contracting
	struct Patent {
	    address author;
	    string jurisdiction;
	    string detailedDescriptionText;
	    string backgroundText;
	    string abstractText;
	    string summaryText;
	    string drawingsIpfsFileHash;
	}
	
	struct ThirdPartyPatentAgentContract {
	    address thirdPartyAddress;
	    string thirdPartyPersona; // 'drawer' or 'nationalizer'
	    string ipfsFileHash;
	    uint payment;
	    bool signed;
	}
	
	    // third party to third party contacting phase
	struct ThirdPartyThirdPartyContract {
	    address proposerAddress;
	    string proposerPersona; // 'nationalizer', 'translator' or 'patent office'
	    address approverAddress;
	    string apporverPersona; // 'nationalizer', 'translator' or 'patent office'
	    string ipfsFileHash;
	    uint payment;
	    bool signed;
	}
	
	
	// events
	
	    // contribution phase
	        // when a contribution was saved to the blockchain
    event contributionAddedSuccessfully(address indexed inventor, string ipfsFileHash);
    
            // when a shares proposal was submitted
    event sharesProposalSubmitted(address indexed proposingInventor);
    
            // when all shares are accepted
	event contributionPhaseFinished();


        // patent agent contracting phase
	        // when inventors need to approve a contract
    event approvePatentAgentContractRequest(address indexed patentAgent, uint payment, string ipfsFileHash);

            // when all parties consented to the linked contract
    event patentAgentInventorsContractApproved(string ipfsFileHash);
    
    
        // patent drafting and third party contracting phase
            // when the patent draft is updated
    event patentDraftUpdated(address indexed patentAgent, string jurisdiction, string detailedDescriptionText, string backgroundText, string abstractText, string summaryText, string drawingsIpfsFileHash);
            
            // when any nationalized patent proposal is updated
    event nationalizedPatentProposalUpdated(address indexed nationalizer, string jurisdiction, string detailedDescriptionText, string backgroundText, string abstractText, string summaryText, string drawingsIpfsFileHash);
    
            // when the patent agent needs to approve a third party contracting
    event approveThirdPartyPatentAgentContractRequest(address indexed thirdPartyAddress, string thirdPartyPersona, uint payment, string ipfsFileHash);
    
            // when a third party contract was approved
    event thirdPartyPatentAgentContractApproved(address indexed thirdPartyAddress, string thirdPartyPersona, string ipfsFileHash);
    
    
        // third party to third party contacting phase
            // when a third party proposes a contract
    event approveContractRequest(address indexed proposerAddress, string proposerPersona, address indexed approverAddress, string approverPersona, uint payment, string ipfsFileHash);
    
            // when the approving third party consents
    event contractApproved(address indexed proposerAddress, string proposerPersona, address indexed approverAddress, string approverPersona, uint payment, string ipfsFileHash);
        


	// properties
	    // contribution and patent agent contracting phase
	mapping(address => string[]) contributionFileHashes;
	Share[] shares;
	bool shareProposalAcceptedByAll;
	PatentAgentInventorContract patentAgentInventorsContract;
	
	    // patent drafting and third party contracting phase
	Patent patentDraft;
	mapping(address => ThirdPartyPatentAgentContract) thirdPartyPatentAgentContracts; // maps third party to contract
	address contractedDrawer;
	address[] contractedNationalizers;
	mapping(address => Patent) nationalizedPatentProposal; // maps nationalizers to localized patent proposals
	
        // patent proposal/submission and third party to third party contracting phase
	mapping(address => ThirdPartyThirdPartyContract) thirdPartyContracts;
	
	
	
	
	// privacy modifiers
	modifier onlyContractedPatentAgent() {
	    require(patentAgentInventorsContract.signed && msg.sender == patentAgentInventorsContract.patentAgent);
	    _;
	}
	
	modifier onlyContractedDrawer() {
	    require(msg.sender == contractedDrawer);
	    _;
	}
	
	modifier onlyContractedNationalizer() {
	    bool isContractedNationalizer = false;
	    for (uint i = 0; i < contractedNationalizers.length; i++) {
	        if (msg.sender == contractedNationalizers[i]) {
	            isContractedNationalizer = true;
	        }
	    }
	    require(isContractedNationalizer);
	    _;
	}
	
	
	modifier onlyPartiesWithAccessToPatent() {
	    bool hasAccess = false;
	    
	    if (isRegisteredAsInventor(msg.sender)) {
	        hasAccess = true;
	    } else if (patentAgentInventorsContract.signed && msg.sender == patentAgentInventorsContract.patentAgent) {
	        hasAccess = true;
	    } else if (contractedDrawer == msg.sender) {
	        hasAccess = true;
	    }
	    for (uint i = 0; i < contractedNationalizers.length; i++) {
	        if (msg.sender == contractedNationalizers[i]) {
	            hasAccess = true;
	        }
	    }
	    
	    require(hasAccess);
		_;
	}


    // constructor
	constructor() public {
		host = msg.sender;
	}


	// functions - contributions and share proposal
	function addContribution(string memory ipfsFileHash) public onlyInventor() {
		contributionFileHashes[msg.sender].push(ipfsFileHash);
		emit contributionAddedSuccessfully(msg.sender, ipfsFileHash);
	}

	function addSharesProposal(address[] memory inventors, uint[] memory percentages) public onlyInventor() {
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
        
        emit sharesProposalSubmitted(msg.sender);
	}
	
	function getAllInventors() public onlyPartiesWithAccessToPatent() view returns(address[] memory inventors) {
	    return allInventors;
	}

	function getContributions(address inventor) public onlyPartiesWithAccessToPatent() view returns(string memory) {
		bool hasAccess = false;
		if (isRegisteredAsInventor(msg.sender)) {
			hasAccess = true;
		}

		require(hasAccess);

		string memory contributionsString = "";
		string[] storage inventorsContributions = contributionFileHashes[inventor];

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

	function approveShare() public onlyInventor() {
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



	// functions - contracting phase
	function uploadInventorsContract(uint payment, string memory ipfsFileHash) public onlyPatentAgent() {
		require(shareProposalAcceptedByAll);
		patentAgentInventorsContract.patentAgent = msg.sender;
		patentAgentInventorsContract.ipfsFileHash = ipfsFileHash;
		patentAgentInventorsContract.signed = false;
		patentAgentInventorsContract.payment = payment;
		emit approvePatentAgentContractRequest(msg.sender, payment, ipfsFileHash);
	}

	function approvePatentAgentContract() public onlyInventor() {	
		require(shareProposalAcceptedByAll && patentAgentInventorsContract.signed == false);
		patentAgentInventorsContract.inventorsConsent[msg.sender] = true;

		bool allInventorsConsented = true;
		for (uint i = 0; i < allInventors.length; i++) {
			allInventorsConsented = allInventorsConsented && patentAgentInventorsContract.inventorsConsent[allInventors[i]];
		}

		if (allInventorsConsented) {
		    patentAgentInventorsContract.signed = true;
		    patentDraft.author = patentAgentInventorsContract.patentAgent;
			emit patentAgentInventorsContractApproved(patentAgentInventorsContract.ipfsFileHash);
		}
	}
	
	
	// functions - patent drafting and third party contracting phase
	function emitPatentDraftUpdatedEvent() internal {
	    emit patentDraftUpdated(patentDraft.author,
	                            patentDraft.jurisdiction, 
	                            patentDraft.detailedDescriptionText, 
	                            patentDraft.backgroundText, 
	                            patentDraft.abstractText, 
	                            patentDraft.summaryText, 
	                            patentDraft.drawingsIpfsFileHash);
	}
	
	function setPatentDraftJurisdiction(string memory jurisdiction) public onlyContractedPatentAgent() {
	    patentDraft.jurisdiction = jurisdiction;
	    emitPatentDraftUpdatedEvent();
	}
	
	function setPatentDraftDetailedDescription(string memory detailedDescriptionText) public onlyContractedPatentAgent() {
	    patentDraft.detailedDescriptionText = detailedDescriptionText;
	    emitPatentDraftUpdatedEvent();
	}
	
	function setPatentDraftBackgroundText(string memory backgroundText) public onlyContractedPatentAgent() {
	    patentDraft.backgroundText = backgroundText;
	    emitPatentDraftUpdatedEvent();
	}
	
	function setPatentDraftAbstractText(string memory abstractText) public onlyContractedPatentAgent() {
	    patentDraft.abstractText = abstractText;
	    emitPatentDraftUpdatedEvent();
	}
	
	function setPatentDraftSummaryText(string memory summaryText) public onlyContractedPatentAgent() {
	    patentDraft.summaryText = summaryText;
	    emitPatentDraftUpdatedEvent();
	}
	
	function setPatentDraftDrawingsIpfsFileHash(string memory drawingsIpfsFileHash) public onlyContractedDrawer() {
	    patentDraft.drawingsIpfsFileHash = drawingsIpfsFileHash;
	    emitPatentDraftUpdatedEvent();
	}
	
	
	
	// nationalizedPatentProposals
	function emitNationalizedPatentProposalUpdatedEvent() internal {
	    emit nationalizedPatentProposalUpdated(nationalizedPatentProposal[msg.sender].author,
	                                           nationalizedPatentProposal[msg.sender].jurisdiction, 
	                                           nationalizedPatentProposal[msg.sender].detailedDescriptionText, 
	                                           nationalizedPatentProposal[msg.sender].backgroundText, 
	                                           nationalizedPatentProposal[msg.sender].abstractText, 
	                                           nationalizedPatentProposal[msg.sender].summaryText,
	                                           nationalizedPatentProposal[msg.sender].drawingsIpfsFileHash);
	}
	
	function setNationalizedPatentProposalJurisdiction(string memory jurisdiction) public onlyContractedPatentAgent() {
	    nationalizedPatentProposal[msg.sender].jurisdiction = jurisdiction;
	}
	
	function setNationalizedPatentProposalDetailedDescription(string memory detailedDescriptionText) public onlyContractedNationalizer() {
	    nationalizedPatentProposal[msg.sender].detailedDescriptionText = detailedDescriptionText;
        emitNationalizedPatentProposalUpdatedEvent();
	}
	
	function setNationalizedPatentProposalBackgroundText(string memory backgroundText) public onlyContractedPatentAgent() {
	    nationalizedPatentProposal[msg.sender].backgroundText = backgroundText;
        emitNationalizedPatentProposalUpdatedEvent();
	}
	
	function setNationalizedPatentProposalAbstractText(string memory abstractText) public onlyContractedPatentAgent() {
	    nationalizedPatentProposal[msg.sender].abstractText = abstractText;
        emitNationalizedPatentProposalUpdatedEvent();
	}
	
	function setNationalizedPatentProposalSummaryText(string memory summaryText) public onlyContractedPatentAgent() {
	    patentDraft.summaryText = summaryText;
        emitNationalizedPatentProposalUpdatedEvent();
	}
	
	function setNationalizedPatentProposalDrawingsIpfsFileHash(string memory drawingsIpfsFileHash) public onlyContractedDrawer() {
	    patentDraft.drawingsIpfsFileHash = drawingsIpfsFileHash;
        emitNationalizedPatentProposalUpdatedEvent();
	}
	
	function uploadThirdPartyPatentAgentContract(string memory persona, uint payment, string memory ipfsFileHash) public {
	    require(isRegisteredForPersona(msg.sender, persona));
	    
	    thirdPartyPatentAgentContracts[msg.sender] = ThirdPartyPatentAgentContract(msg.sender, persona, ipfsFileHash, payment, false);
	    emit approveThirdPartyPatentAgentContractRequest(msg.sender, persona, payment, ipfsFileHash);
	}
	
	function approveThirdPartyPatentAgentContract(address thirdPartyAddress) public onlyContractedPatentAgent() {
        thirdPartyPatentAgentContracts[thirdPartyAddress].signed = true;
        string memory persona = thirdPartyPatentAgentContracts[thirdPartyAddress].thirdPartyPersona;
        if (compareStrings(persona, "drawer")) {
            contractedDrawer = thirdPartyAddress;
        } else if (compareStrings(persona, "nationalizer")) {
            nationalizedPatentProposal[thirdPartyAddress].author = thirdPartyAddress;
            contractedNationalizers.push(thirdPartyAddress);
        }
        emit thirdPartyPatentAgentContractApproved(thirdPartyAddress, persona, thirdPartyPatentAgentContracts[thirdPartyAddress].ipfsFileHash);
	}
	
	// functions - patent proposal/submission and third party to third party contracting phase
	function uploadThirdPartyThirdPartyContract(string memory persona, address approverAddress, string memory approverPersona, uint payment, string memory ipfsFileHash) public {
	    require(isRegisteredForPersona(msg.sender, persona));
	    require(isRegisteredForPersona(approverAddress, approverPersona));
	    
	    thirdPartyContracts[approverAddress] = ThirdPartyThirdPartyContract(msg.sender, persona, approverAddress, approverPersona, ipfsFileHash, payment, false);
	    emit approveContractRequest(msg.sender, persona, approverAddress, approverPersona, payment, ipfsFileHash);
	}
	
	function approveThirdPartyThirdPartyContract(address proposingAddress) public onlyContractedPatentAgent() {
		// WIP
	}
	
	function isRegisteredForPersona(address addr, string memory persona) internal view returns(bool) {
	    if (compareStrings(persona, "drawer")) {
	        return isRegisteredAsDrawer(addr);
	    } else if (compareStrings(persona,"nationalizer")) {
	        return isRegisteredAsNationalizer(addr);
	    } else if (compareStrings(persona, "translator")) {
	        return isRegisteredAsTranslator(addr);
	    } else if (compareStrings(persona, "patentOffice")) {
	        return isRegisteredAsPatentOffice(addr);
	    }
	    return false;
	} 
}
