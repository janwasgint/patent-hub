pragma solidity ^0.5.2;
import "./Host.sol";

/// the patent hub will be hosted by one of the innovators
contract PatentHub is Host {
     
	// ***** STRUCTS *****
		
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
	    string claimsText;
	    string detailedDescriptionText;
	    string backgroundText;
	    string abstractText;
	    string summaryText;
	    string drawingsIpfsFileHash;
	    bool acceptedByPatentOffice;
	}
	
	// contracts between two single parties
	struct OneToOneContract {
	    address payable proposerAddress;
	    string proposerPersona; // 'drawer', 'nationalizer', 'translator' or 'patent office'
	    address approverAddress;
	    string approverPersona; // 'patentAgent' or 'nationalizer'
	    string ipfsFileHash;
	    uint payment;
	    bool signed;
	}
	
	
	// ***** CONTRIBUTION PHASE *****

    // when a contribution was saved to the blockchain
    event contributionAddedSuccessfully(address indexed inventor, string ipfsFileHash);
    
    // when a shares proposal was submitted
    event sharesProposalSubmitted(address indexed proposingInventor, address indexed shareHolder, uint percentage);

    // when a shares proposal is accepted
    event sharesProposalAccepted(address indexed inventor);
    
    // when all shares are accepted
	  event contributionPhaseFinished();


    // ***** PATENT AGENT CONTRACTING PHASE *****
	        
    // when inventors need to approve a contract
    event approvePatentAgentContractRequest(address indexed patentAgent, uint payment, string ipfsFileHash);

    // when one party consented to the linked contract
    event patentAgentOneInventorContractApproved(address indexed inventor);

    // when all parties consented to the linked contract
    event patentAgentInventorsContractApproved(string ipfsFileHash);
    
    
    // ***** PATENT DRAFTING AND 3rd PARTY CONTRACTING PHASE *****

    // when the patent draft is updated
    event patentDraftUpdated(address indexed patentAgent, string jurisdiction, string claimsText, string detailedDescriptionText, string backgroundText, string abstractText, string summaryText, string drawingsIpfsFileHash);
            
    
    // ***** 3rd PARTY TO 3rd PARTY CONTRACTING PHASE *****

    // when a third party proposes a contract
    event approveContractRequest(address indexed proposerAddress, string proposerPersona, address indexed approverAddress, string approverPersona, uint payment, string ipfsFileHash);
    
    // when the approving third party consentsface
    event contractApproved(address indexed proposerAddress, string proposerPersona, address indexed approverAddress, string approverPersona, string ipfsFileHash);
    
    // ***** PATENT OFFICE SUBMISSION *****

    event feePaid();
    
    event nationalPatentAccepted(string jurisdiction, string claimsText, string detailedDescriptionText, string backgroundText, string abstractText, string summaryText, string drawingsIpfsFileHash);
    

	// ***** PROPERTIES *****

    // contribution and patent agent contracting phase
	mapping(address => string[]) contributionFileHashes;
	Share[] shares;
	bool shareProposalAcceptedByAll;
	PatentAgentInventorContract patentAgentInventorsContract;
	
    // patent drafting and third party contracting phase
	Patent patentDraft;
	OneToOneContract drawerContract; // maps third party to contract
	address contractedDrawer;
	
	OneToOneContract[] nationalizerContracts;
	address[] contractedNationalizers;
	mapping(address => Patent) nationalizedPatentProposal; // maps nationalizers to localized patent proposals
	
    // patent proposal/submission and third party to third party contracting phase
	mapping(address => OneToOneContract) translatorContracts;
	address[] contractedTranslators;
	mapping(address => address) translatorToNationalizer; // maps translator addresses to nationalizer addresses
	mapping(address => OneToOneContract) patentOfficeReviews;
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
	    
	    }
	    
	    require(hasAccess);
		_;
	}	

    modifier onlyNationalizedPatentProposalEditors(address nationalizer) {
	    require(msg.sender == nationalizer || translatorToNationalizer[msg.sender] == nationalizer);
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

            emit sharesProposalSubmitted(msg.sender, inventors[i], percentages[i]);
        }
	}
	
	function approveShare() public onlyInventor() {
		shareProposalAcceptedByAll = true;

		for (uint i=0; i<shares.length; i++) {
			if (shares[i].shareholder == msg.sender) {
				shares[i].accepted = true;
        emit sharesProposalAccepted(msg.sender);
			}
			shareProposalAcceptedByAll = shareProposalAcceptedByAll && shares[i].accepted;
        }

        if (shareProposalAcceptedByAll) {
        	emit contributionPhaseFinished();
        }
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
    emit patentAgentOneInventorContractApproved(msg.sender);
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
                              patentDraft.claimsText,
	                            patentDraft.detailedDescriptionText, 
	                            patentDraft.backgroundText, 
	                            patentDraft.abstractText, 
	                            patentDraft.summaryText,
	                            patentDraft.drawingsIpfsFileHash);
	}
	
	
    function setDraft(string memory claimsText, string memory detailedDescriptionText, string memory backgroundText, string memory abstractText, string memory summaryText, string memory drawingsIpfsFileHash) public onlyContractedPatentAgent() {
      patentDraft.claimsText = claimsText;
	    patentDraft.detailedDescriptionText = detailedDescriptionText;
	    patentDraft.backgroundText = backgroundText;
	    patentDraft.abstractText = abstractText;
	    patentDraft.summaryText = summaryText;
        emitPatentDraftUpdatedEvent();
    }

    function setDrawings(string memory drawingsIpfsFileHash) public onlyContractedDrawer() {
	    patentDraft.drawingsIpfsFileHash = drawingsIpfsFileHash;
        emitPatentDraftUpdatedEvent();
    }

    function setNationalizedDraft(address nationalizer, string memory jurisdiction, string memory claimsText, string memory detailedDescriptionText, string memory backgroundText, string memory abstractText, string memory summaryText, string memory drawingsIpfsFileHash) public onlyNationalizedPatentProposalEditors(nationalizer) {
      patentDraft.jurisdiction = jurisdiction;
      patentDraft.claimsText = claimsText;
      patentDraft.detailedDescriptionText = detailedDescriptionText;
	    patentDraft.backgroundText = backgroundText;
	    patentDraft.abstractText = abstractText;
	    patentDraft.summaryText = summaryText;
        emitPatentDraftUpdatedEvent();
    }

	
	// functions - patent proposal/submission and contracting phase
	function uploadContract(string memory persona, address approverAddress, string memory approverPersona, uint payment, string memory ipfsFileHash) public {
	    require(isRegisteredForPersona(msg.sender, persona));
	    require(isRegisteredForPersona(approverAddress, approverPersona));
	    
	    OneToOneContract memory contr = OneToOneContract(msg.sender, persona, approverAddress, approverPersona, ipfsFileHash, payment, false);   
	    
	    if (compareStrings(persona, "drawer")) {
	        drawerContract = contr;
	    } else if (compareStrings(persona, "nationalizer")) {
	        nationalizerContracts.push(contr);
	    } else if (compareStrings(persona, "translator")) {
	        translatorContracts[approverAddress] = contr;
	    } else if (compareStrings(persona, "patentOffice")) {
	        patentOfficeReviews[approverAddress] = contr;
	    }
	    
	    emit approveContractRequest(msg.sender, persona, approverAddress, approverPersona, payment, ipfsFileHash);
	}
	
	function approveContract(address proposerAddress) public {
	    OneToOneContract memory contr;
	    
	    bool nationalizerContractSigned = false;
	    for (uint i = 0; i < nationalizerContracts.length; i++) {
	        if (nationalizerContracts[i].proposerAddress == proposerAddress) {
	            nationalizerContracts[i].signed = true;
	            contractedNationalizers.push(proposerAddress);
	            contr = nationalizerContracts[i];
	            nationalizerContractSigned = true;
	        }
	    }
	    
	    if (nationalizerContractSigned == false) {
	        if (drawerContract.proposerAddress == proposerAddress) {
    	        drawerContract.signed = true;
    	        contractedDrawer = proposerAddress;
    	        contr = drawerContract;
    	    } else if (translatorContracts[msg.sender].proposerAddress == proposerAddress) {
    	        translatorContracts[msg.sender].signed = true;
    	        contractedTranslators.push(proposerAddress);
    	        translatorToNationalizer[proposerAddress] = msg.sender;
    	        contr = translatorContracts[msg.sender];
    	    } else if (patentOfficeReviews[msg.sender].proposerAddress == proposerAddress) {
    	        patentOfficeReviews[msg.sender].signed = true;
    	        reviewingPatentOffices.push(proposerAddress);
    	        patentOfficeToNationalizer[proposerAddress] = msg.sender;
    	        contr = patentOfficeReviews[msg.sender];
    	    } else {
    	        require(false);
    	    }    
	    }
	    
	    emit contractApproved(proposerAddress, contr.proposerPersona, msg.sender, contr.approverPersona, contr.ipfsFileHash);
	}


	// functions - accepting patents and handling payments
  function payPatentOffice() public payable { // onlyContractedNationalizer() {
        address payable patentOffice = patentOfficeReviews[msg.sender].proposerAddress;
        //approveContract(patentOffice);
        uint amount = patentOfficeReviews[msg.sender].payment;       
        //require(patentOffice.send(amount));
        emit feePaid();
  }
	
  function acceptNationalPatent() public onlyPatentOffice() {
        Patent memory patent = nationalizedPatentProposal[msg.sender];                 
        address nationalizer = patentOfficeToNationalizer[msg.sender];
        nationalizedPatentProposal[nationalizer].acceptedByPatentOffice = true;
        emit nationalPatentAccepted(patent.jurisdiction, patent.claimsText, patent.detailedDescriptionText, patent.backgroundText, patent.abstractText, patent.summaryText, patent.drawingsIpfsFileHash);
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
	
	function isRegisteredForPersona(address addr, string memory persona) internal view returns(bool) {
	    if (compareStrings(persona, "drawer")) {
	        return isRegisteredAsDrawer(addr);
	    } else if (compareStrings(persona,"nationalizer")) {
	        return isRegisteredAsNationalizer(addr);
	    } else if (compareStrings(persona, "translator")) {
	        return isRegisteredAsTranslator(addr);
	    } else if (compareStrings(persona, "patentOffice")) {
	        return isRegisteredAsPatentOffice(addr);
	    } else if (compareStrings(persona, "patentAgent")) {
	        return isRegisteredAsPatentAgent(addr);
	    }
	    return false;
	}
}
