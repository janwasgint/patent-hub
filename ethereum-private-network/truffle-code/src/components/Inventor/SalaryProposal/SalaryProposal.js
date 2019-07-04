import React, { Component } from "react";
import PropTypes from "prop-types";

class SalaryProposal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.events && this.props.events.length ? (
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
          <div>No salary proposal has been submitted</div>
        )}
      </div>
    );
  }
}

SalaryProposal.contextTypes = {
  drizzle: PropTypes.object
};

export default SalaryProposal;
