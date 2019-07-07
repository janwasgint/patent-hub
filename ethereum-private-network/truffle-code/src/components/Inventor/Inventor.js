import React, { Component } from "react";
import PropTypes from "prop-types";

import { getContract } from "../../utils/MyContracts.js";
import { mapNameToAddress, ipfsApi } from "../shared.js";

import AddContributionContainer from "./AddContribution/AddContributionContainer";
import ProposeSharesForm from "./ProposeSharesForm";
import ContributionList from "./ContributionList/ContributionList";
import SharesProposal from "./SharesProposal/SharesProposal";
import SalaryProposal from "./SalaryProposal/SalaryProposal";

class Inventor extends Component {
  constructor(props) {
    super(props);

    this.showNewProposalForm = this.showNewProposalForm.bind(this);
    this.hideNewProposalForm = this.hideNewProposalForm.bind(this);
    this.acceptPaymentProposal = this.acceptPaymentProposal.bind(this);
    this.proposeNewSharesDistribution = this.proposeNewSharesDistribution.bind(
      this
    );
    this.createSharesBar = this.createSharesBar.bind(this);
    this.acceptSharesProposal = this.acceptSharesProposal.bind(this);
    this.downloadPdf = this.downloadPdf.bind(this);

    this.state = {
      showNewProposal: false,
      showAcceptProposal: true,
      showAcceptContract: true
    };

    // local copy of the events we are interested in
    this.events = {
      participantRegistered: [],
      sharesProposalSubmitted: [],
      contributionPhaseFinished: [],
      patentAgentInventorsContractApproved: []
    };

    // fetch all events we have to listen to from the contract
    let propsEvents = this.props.PatentHub.events;

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

    // get inventors
    this.inventors = [];
    for (var i = 0; i < this.events.participantRegistered.length; i++) {
      if (this.events.participantRegistered[i].role == "Inventor") {
        this.inventors.push([
          mapNameToAddress(this.events.participantRegistered[i].participant),
          this.events.participantRegistered[i].participant
        ]);
      }
    }

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

    this.shares = [];
    for (
      var i = this.events.sharesProposalSubmitted.length - 1;
      i >= this.events.sharesProposalSubmitted.length - this.inventors.length;
      i--
    ) {
      this.shares.push(this.events.sharesProposalSubmitted[i]);
    }

    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === "contributionPhaseFinished") {
        this.events.contributionPhaseFinished.push({
          status: true
        });
        this.state.showAcceptProposal = false;
      }
    }

    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === "patentAgentInventorsContractApproved") {
        this.events.patentAgentInventorsContractApproved.push({
          status: true
        });
        this.state.showAcceptContract = false;
      }
    }
  }

  getAllEvents() {}

  downloadPdf(ipfsFileHash) {
    ipfsApi.get(ipfsFileHash, function(err, files) {
      files.forEach(file => {
        console.log(file.path);
        console.log(file.content.toString("utf8"));
      });
    });
  }

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

  acceptPaymentProposal() {
    var account = "";
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Could not get accounts!");
      account = result[0];
    });
    // function addSharesProposal(address[] memory inventors, uint[] memory percentages) public onlyInventor() {
    getContract(this.context.drizzle)
      .then(function(instance) {
        return instance.approvePatentAgentContract({
          from: account
        });
      })
      .then(function(result) {
        alert(
          "Contract and payment approved successfully! Transaction Hash: " +
            result.tx
        );
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  }

  // Not implemented in the contract yet
  rejectPaymentProposal() {
    console.log("rejected");
  }

  // Not implemented in the contract yet
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
    let inventorAdresses = testInventors.map(inventor => {
      return inventor[1];
    });

    let inventorShares = testInventors.map(inventor => {
      return parseInt(inventor[2]);
    });

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

  progressbarColors = [
    "progress-bar bg-warning",
    "progress-bar bg-info",
    "progress-bar"
  ];

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
          {mapNameToAddress(this.shares[i].shareHolder)}:{" "}
          {this.shares[i].percentage}%
        </div>
      );
    }
    return shares;
  }

  render() {
    const showNewProposal = this.state.showNewProposal;

    let form = <div />;
    if (showNewProposal) {
      form = (
        <ProposeSharesForm
          inventors={this.inventors}
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
              propsEvents={this.props.PatentHub.events}
              downloadPdf={this.downloadPdf}
              mapNameToAddress={address => mapNameToAddress(address)}
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
              showAcceptProposal={this.state.showAcceptProposal}
              createSharesBar={this.createSharesBar}
              shares={this.shares}
              mapNameToAddress={address => mapNameToAddress(address)}
            />
          </div>
        </div>

        <p />

        <div className="card">
          <h5 className="card-header"> Contract Proposal </h5>
          <div className="card-body">
            <SalaryProposal
              propsEvents={this.props.PatentHub.events}
              acceptPaymentProposal={this.acceptPaymentProposal}
              rejectPaymentProposal={this.rejectPaymentProposal}
              showAcceptContract={this.state.showAcceptContract}
              mapNameToAddress={address => mapNameToAddress(address)}
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
