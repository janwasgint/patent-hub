import React, { Component } from "react";
import PropTypes from "prop-types";
import Blockies from 'react-blockies';

import { getContract } from '../../utils/MyContracts.js';
import AddContributionContainer from "./AddContribution/AddContributionContainer";
import ProposeSharesForm from "./ProposeSharesForm";


const ipfsAPI = require("ipfs-api");
const pdfjsLib = require("pdfjs-dist");

class Inventor extends Component {
  constructor(props) {
    super(props);

    this.ipfsApi = ipfsAPI("localhost", 5001, "https");

    this.showNewProposalForm = this.showNewProposalForm.bind(this);
    this.hideNewProposalForm = this.hideNewProposalForm.bind(this);
    
    this.proposeNewSharesDistribution = this.proposeNewSharesDistribution.bind(this);
    this.createSharesBar = this.createSharesBar.bind(this);
    this.acceptSharesProposal = this.acceptSharesProposal.bind(this);

    this.downloadPdf = this.downloadPdf.bind(this);
    this.state = { showNewProposal: false };

    // local copy of the events we are interested in
    this.events = {
      participantRegistered: [],
      contributionAddedSuccessfully: [],
      sharesProposalSubmitted: [],
    };

    // fetch all events we have to listen to from the contract
    let propsEvents = this.props.PatentHub.events;

    //console.log(propsEvents);
    // iterate all events to get the one we are interested in - participantRegistered(address indexed participant, string role)
    // for events parameters see PatentHub.sol
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === 'participantRegistered') {// && propsEvents[i].returnValues.landlord === props.accounts[0]) {
        this.events.participantRegistered.push({
          participant: propsEvents[i].returnValues.participant,
          role: propsEvents[i].returnValues.role,
        });
      }
    }
    console.log("Participants: " + this.events.participantRegistered);

    // get inventors
    this.inventors = [];
    for (var i = 0; i < this.events.participantRegistered.length; i++) {
      if (this.events.participantRegistered[i].role == 'Inventor') {
        this.inventors.push(this.events.participantRegistered[i].participant)
      }
    }
    console.log(this.inventors);


    //console.log(propsEvents);
    // iterate all events to get the one we are interested in - sharesProposalSubmitted(address indexed proposingInventor, address indexed shareHolder, uint percentage);
    // for events parameters see PatentHub.sol
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === 'sharesProposalSubmitted') {
        this.events.sharesProposalSubmitted.push({
          proposingInventor: propsEvents[i].returnValues.proposingInventor,
          shareHolder: propsEvents[i].returnValues.shareHolder,
          percentage: propsEvents[i].returnValues.percentage,
        });
      }
    }
    console.log("Shares: " + this.events.sharesProposalSubmitted);


    this.shares = [];
    for (var i = this.events.sharesProposalSubmitted.length - 1; i >= this.events.sharesProposalSubmitted.length - this.inventors.length; i--) {
      this.shares.push(this.events.sharesProposalSubmitted[i])
    }

    console.log(this.shares);
    // iterate all events to get the one we are interested in - contributionAddedSuccessfully(address indexed inventor, string ipfsFileHash)
    // for events parameteres see PatentHub.sol
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === 'contributionAddedSuccessfully') {
        this.events.contributionAddedSuccessfully.push({
          inventor: propsEvents[i].returnValues.inventor,
          ipfsFileHash: propsEvents[i].returnValues.ipfsFileHash
        });
      }
    }
    console.log("Contributions: " + this.events.contributionAddedSuccessfully);
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

  testSharesProposal = [["A", "33%"], ["InventorXYZ", "50%"], ["D", "17%"]];

  componentDidMount() { }

  acceptSharesProposal() {
        console.log("accepted");

    var account = '';
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
     if (error != null) console.log("Could not get accounts!");
     account = result[0];
    });

    getContract(this.context.drizzle)
      .then(function(instance) {
        return instance.approveShare({ from: account });
      })
      .then(function(result) {
        alert('Shares proposal approved successfully! Transaction Hash: ' + result.tx);
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });

    console.log("accepted");
  }

  acceptPaymentProposal() {
    console.log("accepted");
  }

  rejectSharesProposal() {
    console.log("rejected");
  }

  rejectPaymentProposal() {
    console.log("rejected");
  }

  showNewProposalForm() {
    this.setState({ showNewProposal: true });
  }

  hideNewProposalForm() {
    this.setState({ showNewProposal: false });
  }

  proposeNewSharesDistribution(testInventors) {


    var inventorAdresses = testInventors.map(inventor => 
      {return inventor[1]})

    var inventorShares = testInventors.map(inventor => {return parseInt(inventor[2])})
    

    // get proposed shares
    var shares = [];
    for (var i = 0; i < this.events.participantRegistered.length; i++) {
      if (this.events.participantRegistered[i].role == 'Inventor') {
        shares.push(50)
      }
    }
    console.log("Proposed shares: " + inventorShares);


    var inventors = this.inventors
    console.log("real Inventors:", inventors)
        console.log("Inventors....", inventorShares, inventorAdresses)

  // Here for Korbi
    var account = '';
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
     if (error != null) console.log("Could not get accounts!");
     account = result[0];
    });
    // function addSharesProposal(address[] memory inventors, uint[] memory percentages) public onlyInventor() {
    getContract(this.context.drizzle)
      .then(function(instance) {  
        console.log("Inventors....", inventorShares, inventorAdresses)

        return instance.addSharesProposal(inventorAdresses, inventorShares, { from: account });
      })
      .then(function(result) {
        alert('Shares proposed successfully! Transaction Hash: ' + result.tx);
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  }

  createSharesBar() {
    let shares = [];
    console.log("shares: ", this.shares)
    for (var i = 0; i < this.shares.length; i++) {
      shares.push(
        <div
          className={this.progressbarColors[i % this.progressbarColors.length]}
          role="progressbar"
          style={{ width: toString(this.shares[i].percentage)+"%" }}
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="100"
          key={i}
        >
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
    let self = this;
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
          <h5 className="card-header">Upload Contribution</h5>
              <div>
                <AddContributionContainer />
              </div>
         </div>

        <p />

        <div className="card">
            <h5 className="card-header">Contribution List</h5>
            <table>
              <thead>
                <tr>
                  <th>Inventor</th>
                  <th>File hash</th>
                </tr>
              </thead>
              {this.events.contributionAddedSuccessfully.map(function(event, i) {
                return (
                  <tbody key={i}>
                    <tr>
                      <td>
                        <Blockies seed={event.inventor} size={10} scale={10} />
                        {event.inventor}
                      </td>
                      <td>{event.ipfsFileHash}</td>
                      /*<td>
                      <button className="form-control btn btn-primary" onClick={self.downloadPdf(event.ipfsFileHash)}>
                        Download
                      </button>
                      </td>*/
                    </tr>
                  </tbody>
                );
              })}
           </table>
        </div>

        <p />   
     
        <div className="card">
          <h5 className="card-header">Share Proposal</h5>
          <div className="card-body">
            <h5 className="card-title">
              InventorXYZ proposed the following share of contributions:
            </h5>

            <div className="progress">{this.createSharesBar()}</div>
            <p />
            <form>
              <div className="row">
                <div className="col">
                  <button
                    type="button"
                    className="form-control btn btn-success"
                    disabled={this.state.showNewProposal}
                    onClick={this.acceptSharesProposal}
                  >
                    Accept
                  </button>
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="form-control btn btn-danger"
                    disabled={this.state.showNewProposal}
                    onClick={this.rejectShareProposal}
                  >
                    Reject
                  </button>
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="form-control btn btn-secondary"
                    onClick={this.showNewProposalForm}
                  >
                    New
                  </button>
                </div>
              </div>
            </form>
            <p />
            {form}
          </div>
        </div>

        <p />

        <div className="card">
          <h5 className="card-header">Salary Proposal</h5>
          <div className="card-body">
            <h5 className="card-title">
              PatentAgentX proposed the following salary:
            </h5>
            <div className="alert alert-dark" role="alert">
              {" "}
              Gimme $$$
            </div>
            <p />
            <form>
              <div className="row">
                <div className="col">
                  <button
                    type="button"
                    className="form-control btn btn-success"
                    onClick={this.acceptPaymentProposal}
                  >
                    Accept
                  </button>
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="form-control btn btn-danger"
                    onClick={this.rejectPaymentProposal}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </form>
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
