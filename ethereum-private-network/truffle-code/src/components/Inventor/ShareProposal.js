import React, { Component } from "react";
import PropTypes from "prop-types";
import Blockies from 'react-blockies';
import SharesProposalForm from "./SharesProposalForm";
import AddContributionContainer from "./AddContribution/AddContributionContainer";

const ipfsAPI = require('ipfs-api');
const pdfjsLib = require('pdfjs-dist');

class ShareProposal extends Component {
  constructor(props) {
    super(props);

    this.ipfsApi = ipfsAPI('localhost', 5001, 'https');

    this.showNewProposalForm = this.showNewProposalForm.bind(this);
    this.cancelNewProposal = this.cancelNewProposal.bind(this);
    this.downloadPdf = this.downloadPdf.bind(this);
    this.state = { showNewProposal: false };

    // local copy of the events we are interested in
    this.events = {
      contributionAddedSuccessfully: [],
    };

    // fetch all events we have to listen to from the contract
    let propsEvents = this.props.PatentHub.events;
    // iterate all events to get the one we are interested in - contributionAddedSuccessfully(address indexed inventor, string ipfsFileHash)
    // for events parameteres see PatentHub.sol
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === 'contributionAddedSuccessfully') {// && propsEvents[i].returnValues.landlord === props.accounts[0]) {
        this.events.contributionAddedSuccessfully.push({
          inventor: propsEvents[i].returnValues.inventor,
          ipfsFileHash: propsEvents[i].returnValues.ipfsFileHash,
        });
      }
    }
    console.log(this.events.contributionAddedSuccessfully);
  }

  progressbarColors = [
    "progress-bar bg-warning",
    "progress-bar bg-info",
    "progress-bar"
  ];

  testSharesProposal = [["A", "33%"], ["InventorXYZ", "50%"], ["D", "17%"]];

  componentDidMount() {}

  acceptShareProposal() {
    console.log("accepted");
  }

  acceptPaymentProposal() {
    console.log("accepted");
  }

  rejectShareProposal() {
    console.log("rejected");
  }

  rejectPaymentProposal() {
    console.log("rejected");
  }

  showNewProposalForm() {
    this.setState({ showNewProposal: true });
  }

  cancelNewProposal() {
    console.log("cancel2");

    this.setState({ showNewProposal: false });
  }

  proposeNewShareDistribution() {
  /*
    // read the values
    // list of inventors addresses, list of shares

    const self = this;
  
    var account = '';
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Could not get accounts!");
      account = result[0];
    });

    var inventorAddr = self.state.value;
    console.log(inventorAddr);

    getContract(this.context.drizzle)
      .then(function(instance) {
        console.log('Sending share to contract...');
        //return instance.AddShare(inventors, shares, { from: account });
      })
      .then(function(result) {
        alert('Share added successfully! Transaction Hash: ' + result.tx);
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });*/
  };





  createSharesBar() {
    let shares = [];
    for (var i = 0; i < this.testSharesProposal.length; i++) {
      shares.push(
        <div
          className={this.progressbarColors[i % this.progressbarColors.length]}
          role="progressbar"
          style={{ width: this.testSharesProposal[i][1] }}
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="100"
          key={this.testSharesProposal[i][0]}
        >
          {this.testSharesProposal[i][0]}: {this.testSharesProposal[i][1]}
        </div>
      );
    }
    return shares;
  }

  sendFiles() {
    console.log("Files sent");
  }

  downloadPdf(ipfsFileHash) {
    this.ipfsApi.get(ipfsFileHash, function (err, files) {
      files.forEach((file) => {
        console.log(file.path)
        console.log(file.content.toString('utf8'))
      })
    })
  }

  render() {
    let self = this;
    const showNewProposal = this.state.showNewProposal;

    let form = <div />;
    if (showNewProposal) {
      form = (
        <SharesProposalForm
          cancel={() => this.cancelNewProposal()}
          propose={() => this.proposeNewShareDistribution()}
        />
      );
    }

    return (
      <div>
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
                    onClick={this.acceptShareProposal}
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

        <p />

        <div className="card">
          <h5 className="card-header">Upload Contribution</h5>
              <div>
                <AddContributionContainer />
              </div>
          {/*<div className="card-body">
            <form>
              <div className="form-group">
                <input
                  type="file"
                  className="form-control-file"
                  id="exampleFormControlFile1"
                />
                <p />
                <button
                  type="button"
                  className="form-control btn btn-primary"
                  onClick={this.sendFiles}
                >
                  Send
                </button>
              </div>
            </form>*/}
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
                        <td>
                        <button className="form-control btn btn-primary" /*onClick={self.downloadPdf(event.ipfsFileHash)}*/>
                          Download
                        </button>
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
             </table>
          </div>
      </div>
    );
  }
}

export default ShareProposal;
