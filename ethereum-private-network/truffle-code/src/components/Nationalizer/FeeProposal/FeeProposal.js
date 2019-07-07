import React, { Component } from "react";
import PropTypes from "prop-types";

class FeeProposal extends Component {
  render() {
    var events = this.props.events;
    var lastProposal = events[events.length - 1];
    return (
      <div>
        {this.props.events && this.props.events.length ? (
          <div>
            <h5 className="card-title">
              {this.props.actor}{" "}
              Fee:
            </h5>
            <div className="alert alert-dark" role="alert">
              {" "}
              <h5>Payment {lastProposal.payment} €</h5>
            </div>

            <p />

            {this.props.showAcceptFee &&
              <form>
                <div className="row">
                  <button
                    type="button"
                    className="form-control btn btn-success"
                    onClick={this.props.acceptPaymentProposal}
                  >
                    Pay
                  </button>
                </div>
              </form>
            }
          
          </div>
        ) : (
          <div>No Patent Office fee to pay yet!</div>
        )}
      </div>
    );
  }
}

FeeProposal.contextTypes = {
  drizzle: PropTypes.object
};

export default FeeProposal;
