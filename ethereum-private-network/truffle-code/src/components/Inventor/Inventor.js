import React, { Component } from "react";
import PropTypes from "prop-types";

import { getContract } from "../../utils/MyContracts.js";
import AddContributionContainer from "./AddContribution/AddContributionContainer";
import ProposeSharesForm from "./ProposeSharesForm";
import ContributionList from "./ContributionList/ContributionList";
import SharesProposal from "./SharesProposal/SharesProposal";
import SalaryProposal from "./SalaryProposal/SalaryProposalPatentAgent";

const ipfsAPI = require("ipfs-api");

class Inventor extends Component {
  constructor(props) {
    super(props);

    this.ipfsApi = ipfsAPI("localhost", 5001, "https");

    this.showNewProposalForm = this.showNewProposalForm.bind(this);
    this.hideNewProposalForm = this.hideNewProposalForm.bind(this);

    this.proposeNewSharesDistribution = this.proposeNewSharesDistribution.bind(
      this
    );
    this.createSharesBar = this.createSharesBar.bind(this);
    this.acceptSharesProposal = this.acceptSharesProposal.bind(this);

    this.downloadPdf = this.downloadPdf.bind(this);
    this.state = { showNewProposal: false };

    // local copy of the events we are interested in
    this.events = {
      participantRegistered: [],
      contributionAddedSuccessfully: [],
      sharesProposalSubmitted: [],
      approvePatentAgentContractRequest: []
    };

    // fetch all events we have to listen to from the contract
    let propsEvents = this.props.PatentHub.events;

    {
      //console.log(propsEvents);
      // iterate all events to get the one we are interested in - participantRegistered(address indexed participant, string role)
      // for events parameters see PatentHub.sol
      for (var i = 0; i < propsEvents.length; i++) {
        if (propsEvents[i].event === "participantRegistered") {
          // && propsEvents[i].returnValues.landlord === props.accounts[0]) {
          this.events.participantRegistered.push({
            participant: propsEvents[i].returnValues.participant,
            role: propsEvents[i].returnValues.role
          });
        }
      }
      //console.log("Participants: " + this.events.participantRegistered);

      // get inventors
      this.inventors = [];
      for (var i = 0; i < this.events.participantRegistered.length; i++) {
        if (this.events.participantRegistered[i].role == "Inventor") {
          this.inventors.push(this.events.participantRegistered[i].participant);
        }
      }

      //console.log(propsEvents);
      // iterate all events to get the one we are interested in - sharesProposalSubmitted(address indexed proposingInventor, address indexed shareHolder, uint percentage);
      // for events parameters see PatentHub.sol
      for (var i = 0; i < propsEvents.length; i++) {
        if (propsEvents[i].event === "sharesProposalSubmitted") {
          this.events.sharesProposalSubmitted.push({
            proposingInventor: propsEvents[i].returnValues.proposingInventor,
            shareHolder: propsEvents[i].returnValues.shareHolder,
            percentage: propsEvents[i].returnValues.percentage
          });
        }
      }
      //console.log("Shares: " + this.events.sharesProposalSubmitted);

      this.shares = [];
      for (
        var i = this.events.sharesProposalSubmitted.length - 1;
        i >= this.events.sharesProposalSubmitted.length - this.inventors.length;
        i--
      ) {
        this.shares.push(this.events.sharesProposalSubmitted[i]);
      }

      // iterate all events to get the one we are interested in - contributionAddedSuccessfully(address indexed inventor, string ipfsFileHash)
      // for events parameteres see PatentHub.sol
      for (var i = 0; i < propsEvents.length; i++) {
        if (propsEvents[i].event === "contributionAddedSuccessfully") {
          this.events.contributionAddedSuccessfully.push({
            inventor: propsEvents[i].returnValues.inventor,
            ipfsFileHash: propsEvents[i].returnValues.ipfsFileHash
          });
        }
      }
      /*console.log(
        "Contributions: " + this.events.contributionAddedSuccessfully
      );*/

      for (var i = 0; i < propsEvents.length; i++) {
        if (propsEvents[i].event === "approvePatentAgentContractRequest") {
          this.events.approvePatentAgentContractRequest.push({
            patentAgent: propsEvents[i].returnValues.patentAgent,
            ipfsFileHash: propsEvents[i].returnValues.ipfsFileHash,
            payment: propsEvents[i].returnValues.payment
          });
        }
      }
    }
  }

  progressbarColors = [
    "progress-bar bg-warning",
    "progress-bar bg-info",
    "progress-bar"
  ];

  testInventors = [
    ["Jan", "0x5764e7337dfae66f5ac5551ebb77307709fb0219"],
    ["Luca", "0x11c2e86ebecf701c265f6d19036ec90d277dd2b3"],
    ["Korbi", "0xc33a1d62e6de00d4c9b135718280411101bcb9dd"]
  ];

  inventorAndAddress = [
    { address: "0x5764e7337dfae66f5ac5551ebb77307709fb0219", name: "Jan" },
    { address: "0x11c2e86ebecf701c265f6d19036ec90d277dd2b3", name: "Luca" },
    { address: "0xc33a1d62e6de00d4c9b135718280411101bcb9dd", name: "Korbi" },
    { address: "0x01edfe893343e51f89b323c702e21868109bbf1f", name: "Goofy" },
    { address: "0x298bd2bd1aab49b7a8bb0943ab972bd53b084f09", name: "Donald" },
    { address: "0x95057ead904141f497cdbad7714b295e12f8c48a", name: "Mickey" }
  ];

  componentDidMount() {}

  acceptSharesProposal() {
    var account = "";
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Could not get accounts!");
      account = result[0];
    });

    getContract(this.context.drizzle)
      .then(function(instance) {
        return instance.approveShare({ from: account });
      })
      .then(function(result) {
        alert(
          "Shares proposal approved successfully! Transaction Hash: " +
            result.tx
        );
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  }

  // @Luca Todo: implement function logic
  acceptPaymentProposal() {
    console.log("accepted");
  }

  // @Luca Todo: implement function logic
  rejectPaymentProposal() {
    console.log("rejected");
  }

  // @Luca Todo: implement function logic
  rejectSharesProposal() {
    console.log("rejected");
  }

  showNewProposalForm() {
    this.setState({ showNewProposal: true });
  }

  hideNewProposalForm() {
    this.setState({ showNewProposal: false });
  }

  proposeNewSharesDistribution(testInventors) {
    {
      let inventorAdresses = testInventors.map(inventor => {
        return inventor[1];
      });

      let inventorShares = testInventors.map(inventor => {
        return parseInt(inventor[2]);
      });

      // Here for Korbi
      var account = "";
      this.context.drizzle.web3.eth.getAccounts(function(error, result) {
        if (error != null) console.log("Could not get accounts!");
        account = result[0];
      });
      // function addSharesProposal(address[] memory inventors, uint[] memory percentages) public onlyInventor() {
      getContract(this.context.drizzle)
        .then(function(instance) {
          return instance.addSharesProposal(inventorAdresses, inventorShares, {
            from: account
          });
        })
        .then(function(result) {
          alert("Shares proposed successfully! Transaction Hash: " + result.tx);
          console.log(result);
        })
        .catch(function(err) {
          console.log(err.message);
        });
    }
  }

  mapNameToAddress(address) {
    var inventorName;
    this.inventorAndAddress.forEach(inventor => {
      if (inventor.address.toUpperCase() === address.toUpperCase()) {
        inventorName = inventor.name;
      }
    });

    return inventorName;
  }

  createSharesBar() {
    let shares = [];

    if (typeof this.shares[0].percentage === "undefined") {
      return shares;
    }
    for (var i = 0; i < this.shares.length; i++) {
      shares.push(
        <div
          className={this.progressbarColors[i % this.progressbarColors.length]}
          role="progressbar"
          style={{ width: this.shares[i].percentage.toString() + "%" }}
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="100"
          key={i}
        >
          {this.mapNameToAddress(this.shares[i].shareHolder)}:{" "}
          {this.shares[i].percentage}
        </div>
      );
    }
    return shares;
  }

  sendFiles() {
    console.log("Files sent");
  }

  downloadPdf(ipfsFileHash) {
    this.ipfsApi.get(ipfsFileHash, function(err, files) {
      files.forEach(file => {
        console.log(file.path);
        console.log(file.content.toString("utf8"));
      });
    });
  }

  render() {
    const showNewProposal = this.state.showNewProposal;

    let form = <div />;
    if (showNewProposal) {
      form = (
        <ProposeSharesForm
          inventors={this.testInventors}
          hide={() => this.hideNewProposalForm()}
          propose={this.proposeNewSharesDistribution}
        />
      );
    }

    return (
      <div>
        <div className="card">
          <h5 className="card-header"> Upload Contribution </h5>
          <div className="card-body">
            <AddContributionContainer />
          </div>
        </div>
        <p />

        <div className="card">
          <h5 className="card-header"> Contribution List </h5>
          <div className="card-body">
            <ContributionList
              events={this.events.contributionAddedSuccessfully}
              downloadPdf={this.downloadPdf}
              mapNameToAddress={address => this.mapNameToAddress(address)}
            />
          </div>
        </div>
        <p />

        <div className="card">
          <h5 className="card-header"> Share Proposal </h5>
          <div className="card-body">
            <SharesProposal
              form={form}
              acceptSharesProposal={this.acceptSharesProposal}
              rejectShareProposal={this.rejectShareProposal}
              showNewProposalForm={this.showNewProposalForm}
              showNewProposal={this.state.showNewProposal}
              createSharesBar={this.createSharesBar}
              shares={this.shares}
              mapNameToAddress={address => this.mapNameToAddress(address)}
            />
          </div>
        </div>

        <p />

        <div className="card">
          <h5 className="card-header"> Contract Proposal </h5>
          <div className="card-body">
            <SalaryProposal
              events={this.events.approvePatentAgentContractRequest}
              acceptPaymentProposal={this.acceptPaymentProposal}
              rejectPaymentProposal={this.rejectPaymentProposal}
              mapNameToAddress={address => this.mapNameToAddress(address)}
              downloadPdf={this.downloadPdf}
              actor={"Patent Agent"}
            />
          </div>
        </div>
      </div>
    );
  }
}

Inventor.contextTypes = {
  drizzle: PropTypes.object
};

export default Inventor;
