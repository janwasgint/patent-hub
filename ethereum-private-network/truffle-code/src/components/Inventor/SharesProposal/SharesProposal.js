import React, { Component } from "react";
import PropTypes from "prop-types";

class SharesProposal extends Component {
  constructor(props) {
    super(props);
  }

  getInventor() {
    if (this.props.shares[0]) {
      return this.props.shares[0].proposingInventor;
    }
  }

  render() {
    var inventorAddress = this.getInventor();

    if (!this.props.shares[0]) {
      return (
        <div>
          <button
            type="button"
            className="form-control btn btn-secondary"
            onClick={this.props.showNewProposalForm}
          >
            New Proposal
          </button>
          <p />
          {this.props.form}
        </div>
      );
    } else {
      return (
        <div>
          <h5 className="card-title">
            {this.props.mapNameToAddress(inventorAddress)} proposed the
            following share of contributions:
          </h5>

          <div className="progress"> {this.props.createSharesBar()} </div>
          <p />
          <form>
            <div className="row">
              <div className="col">
                <button
                  type="button"
                  className="form-control btn btn-success"
                  disabled={this.props.showNewProposal}
                  onClick={this.props.acceptSharesProposal}
                >
                  Accept
                </button>
              </div>
              <div className="col">
                <button
                  type="button"
                  className="form-control btn btn-danger"
                  disabled={this.props.showNewProposal}
                  onClick={this.props.rejectShareProposal}
                >
                  Reject
                </button>
              </div>
              <div className="col">
                <button
                  type="button"
                  className="form-control btn btn-secondary"
                  onClick={this.props.showNewProposalForm}
                >
                  New
                </button>
              </div>
            </div>
          </form>
          <p />
          {this.props.form}
        </div>
      );
    }
  }
}

SharesProposal.contextTypes = {
  drizzle: PropTypes.object
};

export default SharesProposal;
