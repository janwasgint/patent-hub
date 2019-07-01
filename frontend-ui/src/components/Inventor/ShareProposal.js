import React, { Component } from "react";
import PropTypes from "prop-types";
import SharesProposalForm from "./SharesProposalForm";

class ShareProposal extends Component {
  constructor(props) {
    super(props);
    this.showNewProposalForm = this.showNewProposalForm.bind(this);
    this.cancelNewProposal = this.cancelNewProposal.bind(this);
    this.state = { showNewProposal: false };
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

  proposeNewShareDistribution() {}

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
          <h5 className="card-header">Files for Patent Agent</h5>
          <div className="card-body">
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
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ShareProposal;
