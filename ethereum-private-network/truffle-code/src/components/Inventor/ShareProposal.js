import React, { Component } from "react";
import PropTypes from "prop-types";
import SharesProposalForm from "./SharesProposalForm";
import AddContributionContainer from "./AddContribution/AddContributionContainer";

class ShareProposal extends Component {
  constructor(props) {
    super(props);
    this.showNewProposalForm = this.showNewProposalForm.bind(this);
    this.hideNewProposalForm = this.hideNewProposalForm.bind(this);
    this.state = { showNewProposal: false };
  }

  progressbarColors = [
    "progress-bar bg-warning",
    "progress-bar bg-info",
    "progress-bar"
  ];

  inventors = [
    ["Jan", "0x5764e7337dfae66f5ac5551ebb77307709fb0219"],
    ["Luca", "0x11c2e86ebecf701c265f6d19036ec90d277dd2b3"],
    ["Korbi", "0xc33a1d62e6de00d4c9b135718280411101bcb9dd"]
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

  hideNewProposalForm() {
    this.setState({ showNewProposal: false });
  }

  proposeNewShareDistribution(inventors) {
    console.log("new propsal");
    console.log("inventorShares:", inventors);

    // read the values
    /*

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
  }

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

  render() {
    const showNewProposal = this.state.showNewProposal;

    let form = <div />;
    if (showNewProposal) {
      form = (
        <SharesProposalForm
          inventors={this.inventors}
          hide={() => this.hideNewProposalForm()}
          propose={this.proposeNewShareDistribution}
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
          <h5 className="card-header">Files for Patent Agent</h5>
          <div className="card-body">
            <AddContributionContainer />
            {/*
            <form>

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

            </form>
          */}
          </div>
        </div>
      </div>
    );
  }
}

export default ShareProposal;
