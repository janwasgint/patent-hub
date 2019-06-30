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
	    string proposerPersona; // 'translator' or 'patent office'
	    address approverAddress;
	    string approverPersona; // currently always 'nationalizer'
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
    
            // when the approving third party consentsface
    event contractApproved(address indexed proposerAddress, string proposerPersona, address indexed approverAddress, string approverPersona, string ipfsFileHash);
    
        // patent office submission and payment handling
            // when the process is completed and a settling of payments is requested
    event paymentsRequested();
    
            // when all payments are settled
    event nationalPatentAccepted(string jurisdiction, string detailedDescriptionText, string backgroundText, string abstractText, string summaryText, string drawingsIpfsFileHash);
    
    function acceptNationalPatent() public {
        require(isReviewingPatentOffice(msg.sender));
        
        address nationalizer = patentOfficeToNationalizer[msg.sender];
        
        Patent memory patent = nationalizedPatentProposal[nationalizer];
        
        emit nationalPatentAccepted(patent.jurisdiction, patent.detailedDescriptionText, patent.backgroundText, patent.abstractText, patent.summaryText, patent.drawingsIpfsFileHash);
    }

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
	mapping(address => ThirdPartyThirdPartyContract) translatorContracts;
	address[] contractedTranslators;
	mapping(address => address) translatorToNationalizer; // maps translator addresses to nationalizer addresses
	mapping(address => ThirdPartyThirdPartyContract) patentOfficeReviews;
	address[] reviewingPatentOffices;
	mapping(address => address) patentOfficeToNationalizer; // maps patent office addresses to nationalizer addresses
	
	
	
	
	// privacy modifiers
	modifier onlyContractedPatentAgent() {
	    require(isContractedPatentAgent(msg.sender));
	    _;
	}
	
	modifier onlyContractedDrawer() {
	    require(msg.sender == contractedDrawer);
	    _;
	}
	
	modifier onlyContractedNationalizer() {
	    require(isContractedNationalizer(msg.sender));
	    _;
	}
	
	
	modifier onlyPartiesWithAccessToPatent() {
	    bool hasAccess = false;
	    
	    if (isRegisteredAsInventor(msg.sender)) {
	        hasAccess = true;
	    } else if (isContractedPatentAgent(msg.sender)) {
	        hasAccess = true;
	    } else if (contractedDrawer == msg.sender) {
	        hasAccess = true;
	    } else if (isContractedNationalizer(msg.sender)) {
	        hasAccess = true;
	    } else if (isContractedTranslator(msg.sender)) {
	        hasAccess = true;
	    } else if (isReviewingPatentOffice(msg.sender)) {
	        hasAccess = true;
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
	
	    // setters
	function setPatentDraftJurisdiction(string memory jurisdiction) public onlyContractedPatentAgent() {
	    patentDraft.jurisdiction = jurisdiction;
	    emitPatentDraftUpdatedEvent();
	}
	
	function setPatentDraftDetailedDescriptionText(string memory detailedDescriptionText) public onlyContractedPatentAgent() {
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
	    // getters
	function getPatentDraftJurisdiction() public view onlyPartiesWithAccessToPatent() returns(string memory) {
	    return patentDraft.jurisdiction;
	}
	
	function getPatentDraftDetailedDescription() public view onlyPartiesWithAccessToPatent() returns(string memory) {
	    return patentDraft.detailedDescriptionText;
	}
	
	function getPatentDraftBackground() public view onlyPartiesWithAccessToPatent() returns(string memory) {
	    return patentDraft.backgroundText;
	}
	
	function getPatentDraftAbstract() public view onlyPartiesWithAccessToPatent() returns(string memory) {
	    return patentDraft.abstractText;
	}
	
	function getPatentDraftSummary() public view onlyPartiesWithAccessToPatent() returns(string memory) {
	    return patentDraft.summaryText;
	}
	
	function getPatentDraftDrawingsIpfsFileHash() public view onlyPartiesWithAccessToPatent() returns(string memory) {
	    return patentDraft.drawingsIpfsFileHash;
	}
	
	
	// nationalizedPatentProposals
	function emitNationalizedPatentProposalUpdatedEvent(address nationalizer) internal {
	    emit nationalizedPatentProposalUpdated(nationalizedPatentProposal[nationalizer].author,
	                                           nationalizedPatentProposal[nationalizer].jurisdiction, 
	                                           nationalizedPatentProposal[nationalizer].detailedDescriptionText, 
	                                           nationalizedPatentProposal[nationalizer].backgroundText, 
	                                           nationalizedPatentProposal[nationalizer].abstractText, 
	                                           nationalizedPatentProposal[nationalizer].summaryText,
	                                           nationalizedPatentProposal[nationalizer].drawingsIpfsFileHash);
	}
	
	modifier onlyNationalizedPatentProposalEditors(address nationalizer) {
	    require(msg.sender == nationalizer || translatorToNationalizer[msg.sender] == nationalizer);
	    _;
	}
	    // setters
	function setNationalizedPatentProposalJurisdiction(address nationalizer, string memory jurisdiction) public onlyNationalizedPatentProposalEditors(nationalizer) {
	    nationalizedPatentProposal[nationalizer].jurisdiction = jurisdiction;
	    emitNationalizedPatentProposalUpdatedEvent(nationalizer);
	}
	
	function setNationalizedPatentProposalDetailedDescriptionText(address nationalizer, string memory detailedDescriptionText) public  onlyNationalizedPatentProposalEditors(nationalizer) {
	    require(isRegisteredAsNationalizer(nationalizer));
	    require(isContractedNationalizer(msg.sender) || isContractedTranslator(msg.sender));
	    nationalizedPatentProposal[nationalizer].detailedDescriptionText = detailedDescriptionText;
        emitNationalizedPatentProposalUpdatedEvent(nationalizer);
	}
	
	function setNationalizedPatentProposalBackgroundText(address nationalizer, string memory backgroundText) public  onlyNationalizedPatentProposalEditors(nationalizer) {
	    nationalizedPatentProposal[nationalizer].backgroundText = backgroundText;
        emitNationalizedPatentProposalUpdatedEvent(nationalizer);
	}
	
	function setNationalizedPatentProposalAbstractText(address nationalizer, string memory abstractText) public  onlyNationalizedPatentProposalEditors(nationalizer) {
	    nationalizedPatentProposal[nationalizer].abstractText = abstractText;
        emitNationalizedPatentProposalUpdatedEvent(nationalizer);
	}
	
	function setNationalizedPatentProposalSummaryText(address nationalizer, string memory summaryText) public  onlyNationalizedPatentProposalEditors(nationalizer) {
	    patentDraft.summaryText = summaryText;
        emitNationalizedPatentProposalUpdatedEvent(nationalizer);
	}
	
	function setNationalizedPatentProposalDrawingsIpfsFileHash(address nationalizer, string memory drawingsIpfsFileHash) public  onlyNationalizedPatentProposalEditors(nationalizer) {
	    patentDraft.drawingsIpfsFileHash = drawingsIpfsFileHash;
        emitNationalizedPatentProposalUpdatedEvent(nationalizer);
	}
	
	    // getters
	function getNationalizedPatentProposalJurisdiction(address nationalizer) public view onlyPartiesWithAccessToPatent() returns(string memory) {
	    return nationalizedPatentProposal[nationalizer].jurisdiction;
	}
	
	function getNationalizedPatentProposalDetailedDescription(address nationalizer) public view onlyPartiesWithAccessToPatent() returns(string memory) {
	    return nationalizedPatentProposal[nationalizer].detailedDescriptionText;
	}
	
	function getNationalizedPatentProposalBackground(address nationalizer) public view onlyPartiesWithAccessToPatent() returns(string memory) {
	    return nationalizedPatentProposal[nationalizer].backgroundText;
	}
	
	function getNationalizedPatentProposalAbstract(address nationalizer) public view onlyPartiesWithAccessToPatent() returns(string memory) {
	    return nationalizedPatentProposal[nationalizer].abstractText;
	}
	
	function getNationalizedPatentProposalSummary(address nationalizer) public view onlyPartiesWithAccessToPatent() returns(string memory) {
	    return nationalizedPatentProposal[nationalizer].summaryText;
	}
	
	function getNationalizedPatentProposalDrawingsIpfsFileHash(address nationalizer) public view onlyPartiesWithAccessToPatent() returns(string memory) {
	    return nationalizedPatentProposal[nationalizer].drawingsIpfsFileHash;
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
	    
	    ThirdPartyThirdPartyContract memory contr = ThirdPartyThirdPartyContract(msg.sender, persona, approverAddress, approverPersona, ipfsFileHash, payment, false);   
	    
	    if (compareStrings(persona, "translator")) {
	        translatorContracts[approverAddress] = contr;
	    } else  if (compareStrings(persona, "patentOffice")) {
	        patentOfficeReviews[approverAddress] = contr;
	    }
	    
	    emit approveContractRequest(msg.sender, persona, approverAddress, approverPersona, payment, ipfsFileHash);
	}
	
	function approveThirdPartyThirdPartyContract(address proposerAddress) public {
	    ThirdPartyThirdPartyContract memory contr;
	    if (translatorContracts[msg.sender].proposerAddress == proposerAddress) {
	        contr = translatorContracts[msg.sender];
	    } else if (patentOfficeReviews[msg.sender].proposerAddress == proposerAddress) {
	        contr = patentOfficeReviews[msg.sender];
	    } else {
	        require(false);
	    }
	    
	    contr.signed = true;
	    
	    string memory proposerPersona = contr.proposerPersona;
	    string memory approverPersona = contr.approverPersona;
	    
	    if (compareStrings(approverPersona, "nationalizer")) {
    	    if (compareStrings(proposerPersona, "translator")) {
    	        contractedTranslators.push(proposerAddress);
    	        translatorToNationalizer[proposerAddress] = msg.sender;
    	        
    	    } else if (compareStrings(proposerPersona, "patentOffice")) {
    	        reviewingPatentOffices.push(proposerAddress);
    	        patentOfficeToNationalizer[proposerAddress] = msg.sender;
    	    }
	    }
	    
	    emit contractApproved(proposerAddress, proposerPersona, msg.sender, approverPersona, contr.ipfsFileHash);
	}
	
	function relatedNationalizerForTranslator() public view returns(address) {
	    require(isContractedTranslator(msg.sender));
	    return translatorToNationalizer[msg.sender];
	}
	
	function relatedNationalizerForPatentOffice() public view returns(address) {
	    require(isReviewingPatentOffice(msg.sender));
	    return patentOfficeToNationalizer[msg.sender];
	}
	
	// functions - helper functions specific to patent hub use case
	function isContractedPatentAgent(address addr) internal view returns(bool) {
        return patentAgentInventorsContract.signed && addr == patentAgentInventorsContract.patentAgent;
    }
    
	function isContractedNationalizer(address addr) internal view returns(bool) {
	    bool isContained = false;
	    for (uint i = 0; i < contractedNationalizers.length; i++) {
	        if (addr == contractedNationalizers[i]) {
	            isContained = true;
	        }
	    }
	    return isContained;
	}
	
	function isContractedTranslator(address addr) internal view returns(bool) {
	    bool isContained = false;
	    for (uint i = 0; i < contractedTranslators.length; i++) {
	        if (addr == contractedTranslators[i]) {
	            isContained = true;
	        }
	    }
	    return isContained;
	}
	
	function isReviewingPatentOffice(address addr) internal view returns(bool) {
	    bool isContained = false;
	    for (uint i = 0; i < reviewingPatentOffices.length; i++) {
	        if (addr == reviewingPatentOffices[i]) {
	            isContained = true;
	        }
	    }
	    return isContained;
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
