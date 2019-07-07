import React, { Component } from "react";
import PropTypes from "prop-types";

class SalaryProposal extends Component {
  render() {
    var events = this.props.events;
    var lastProposal = events[events.length - 1];
    return (
      <div>
        {this.props.events && this.props.events.length ? (
          <div>
            <h5 className="card-title">
              {this.props.actor}{" "}
              {this.props.mapNameToAddress(lastProposal.proposer)} proposed the
              following payment and contract:
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

            {this.props.showAcceptProposal && (
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
            {!this.props.showAcceptProposal && (
              <div>
                <div className="alert alert-success" role="alert">
                  Contract and salary proposal has been accepted.
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
