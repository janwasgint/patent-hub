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
              Patent Agent{" "}
              {this.props.mapNameToAddress(lastProposal.patentAgent)} proposed
              the following contract and payment:
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
          </div>
        ) : (
          <div>No salary has been proposed</div>
        )}
      </div>
    );
  }
}

SalaryProposal.contextTypes = {
  drizzle: PropTypes.object
};

export default SalaryProposal;
