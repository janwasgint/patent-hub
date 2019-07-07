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

  proposeNewSharesDistribution(testInventors, self) {
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
      .then(instance => {
        return instance.addSharesProposal(inventorAdresses, inventorShares, {
          from: account
        });
      })
      .then(result => {
        alert("Shares proposed successfully! Transaction Hash: " + result.tx);
        console.log(result);
        this.setState({ showNewProposal: false });
      })
      .catch(function(err) {
        console.log(err.message);
      });
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
              propsEvents={this.props.PatentHub.events}
              form={form}
              acceptSharesProposal={this.acceptSharesProposal}
              rejectShareProposal={this.rejectShareProposal}
              showNewProposalForm={this.showNewProposalForm}
              showNewProposal={this.state.showNewProposal}
              showAcceptProposal={this.state.showAcceptProposal}
              inventors={this.inventors}
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
