import React, { Component } from "react";
import PropTypes from "prop-types";

class SalaryProposal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
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
    );
  }
}

SalaryProposal.contextTypes = {
  drizzle: PropTypes.object
};

export default SalaryProposal;
