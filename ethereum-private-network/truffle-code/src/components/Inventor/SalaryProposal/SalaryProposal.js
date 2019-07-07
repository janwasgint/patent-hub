import React, { Component } from "react";
import PropTypes from "prop-types";

class SalaryProposal extends Component {
  constructor(props) {
    super(props);

    this.state = { approvePatentAgentContractRequest: [] };
    this.fetchPatentAgentApprovals();
  }

  fetchPatentAgentApprovals() {
    var propsEvents = this.props.propsEvents;
    var tempApprovePatentAgentContractRequest = [];

    // iterate all events to get the one we are interested in - approvePatentAgentContractRequest(address indexed inventor, string ipfsFileHash)
    // for events parameteres see PatentHub.sol
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === "approvePatentAgentContractRequest") {
        tempApprovePatentAgentContractRequest.push({
          patentAgent: propsEvents[i].returnValues.patentAgent,
          ipfsFileHash: propsEvents[i].returnValues.ipfsFileHash,
          payment: propsEvents[i].returnValues.payment
        });
      }
    }
    if (
      this.state.approvePatentAgentContractRequest.length !=
      tempApprovePatentAgentContractRequest.length
    ) {
      this.state.approvePatentAgentContractRequest = tempApprovePatentAgentContractRequest;
    }
  }

  render() {
    this.fetchPatentAgentApprovals();

    var events = this.state.approvePatentAgentContractRequest;
    var lastProposal = events[events.length - 1];

    return (
      <div>
        {this.state.approvePatentAgentContractRequest &&
        this.state.approvePatentAgentContractRequest.length ? (
          <div>
            <h5 className="card-title">
              {this.props.actor}{" "}
              {this.props.mapNameToAddress(lastProposal.patentAgent)} proposed
              the following payment and contract:
            </h5>
            <div className="alert alert-dark" role="alert">
              {" "}
              <h5>Payment {lastProposal.payment} €</h5>
              <button
                type="button"
                className="form-control btn btn-secondary"
                onClick={() =>
                  this.props.downloadPdf(lastProposal.ipfsFileHash)
                }
              >
                Download Contract
              </button>
            </div>
            <p />
            {this.props.showAcceptContract && (
              <form>
                <div className="row">
                  <div className="col">
                    <button
                      type="button"
                      className="form-control btn btn-success"
                      onClick={this.props.acceptPaymentProposal}
                    >
                      Accept
                    </button>
                  </div>
                  <div className="col">
                    <button
                      type="button"
                      className="form-control btn btn-danger"
                      onClick={this.props.rejectPaymentProposal}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </form>
            )}
            {!this.props.showAcceptContract && (
              <div>
                <div className="alert alert-success" role="alert">
                  All inventors accepted the contract and salary proposal.
                </div>
              </div>
            )}
            {this.props.hasAcceptedSalary && (
              <div>
                <p />

                <div className="alert alert-success" role="alert">
                  You have accepted the contract and salary proposal.
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>No contract has been proposed yet!</div>
        )}
      </div>
    );
  }
}

SalaryProposal.contextTypes = {
  drizzle: PropTypes.object
};

export default SalaryProposal;
