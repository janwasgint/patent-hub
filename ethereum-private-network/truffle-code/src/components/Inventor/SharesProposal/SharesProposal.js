import React, { Component } from "react";
import PropTypes from "prop-types";

class SharesProposal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h5 className="card-title">
          InventorXYZ proposed the following share of contributions:
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

SharesProposal.contextTypes = {
  drizzle: PropTypes.object
};

export default SharesProposal;
