import React, { Component } from "react";
import PropTypes from "prop-types";

class SharesProposal extends Component {
  constructor(props) {
    super(props);

    this.state = { shares: [], sharesProposalSubmitted: [] };
    this.createSharesBar = this.createSharesBar.bind(this);

    var propsEvents = this.props.propsEvents;

    this.events = {
      sharesProposalSubmitted: []
    };

    // iterate all events to get the one we are interested in - sharesProposalSubmitted(address indexed proposingInventor, address indexed shareHolder, uint percentage);
    // for events parameters see PatentHub.sol
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === "sharesProposalSubmitted") {
        this.events.sharesProposalSubmitted.push({
          proposingInventor: propsEvents[i].returnValues.proposingInventor,
          shareHolder: propsEvents[i].returnValues.shareHolder,
          percentage: propsEvents[i].returnValues.percentage
        });
      }
    }

    this.shares = [];
    for (
      var i = this.events.sharesProposalSubmitted.length - 1;
      i >=
      this.events.sharesProposalSubmitted.length - this.props.inventors.length;
      i--
    ) {
      this.shares.push(this.events.sharesProposalSubmitted[i]);
    }
  }

  progressbarColors = [
    "progress-bar bg-warning",
    "progress-bar bg-info",
    "progress-bar"
  ];

  getInventor(shares) {
    if (shares[0]) {
      return shares[0].proposingInventor;
    }
  }

  createSharesBar() {
    let shares = [];
    if (
      typeof this.state.sharesProposalSubmitted[0].percentage === "undefined"
    ) {
      return shares;
    }
    for (
      var i = this.state.sharesProposalSubmitted.length - 3;
      i < this.state.sharesProposalSubmitted.length;
      i++
    ) {
      shares.push(
        <div
          className={this.progressbarColors[i % this.progressbarColors.length]}
          role="progressbar"
          style={{
            width:
              this.state.sharesProposalSubmitted[i].percentage.toString() + "%"
          }}
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="100"
          key={i}
        >
          {this.props.mapNameToAddress(
            this.state.sharesProposalSubmitted[i].shareHolder
          )}
          : {this.state.sharesProposalSubmitted[i].percentage}%
        </div>
      );
    }
    return shares;
  }

  fetchShares() {
    var propsEvents = this.props.propsEvents;
    var tempSharesProposalSubmitted = [];

    // iterate all events to get the one we are interested in - contributionAddedSuccessfully(address indexed inventor, string ipfsFileHash)
    // for events parameteres see PatentHub.sol
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === "sharesProposalSubmitted") {
        tempSharesProposalSubmitted.push({
          proposingInventor: propsEvents[i].returnValues.proposingInventor,
          shareHolder: propsEvents[i].returnValues.shareHolder,
          percentage: propsEvents[i].returnValues.percentage
        });
      }
    }
    if (
      this.state.sharesProposalSubmitted.length !=
        tempSharesProposalSubmitted.length ||
      this.checkForChanges(tempSharesProposalSubmitted)
    ) {
      this.state.sharesProposalSubmitted = tempSharesProposalSubmitted;
    }
  }

  checkForChanges(newShares) {
    let changes = false;

    for (
      var i =
        this.state.sharesProposalSubmitted.length - this.props.inventors.length;
      i < this.state.sharesProposalSubmitted.length;
      i++
    ) {
      if (
        this.state.sharesProposalSubmitted[i].percentage !=
        newShares[i].percentage
      ) {
        changes = true;
      }
    }
    return changes;
  }

  render() {
    this.fetchShares();

    var inventorAddress = this.getInventor(this.shares);

    if (!this.shares[0]) {
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
            following shares of contributions:
          </h5>
          <div className="progress"> {this.createSharesBar()} </div>
          <p />
          {this.props.showAcceptProposal && (
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
          )}
          {!this.props.showAcceptProposal && (
            <div>
              <div className="alert alert-success" role="alert">
                All inventors accepted the shares proposal.
              </div>
            </div>
          )}
          {this.props.hasAcceptedShares && (
            <div>
              <p />

              <div className="alert alert-success" role="alert">
                You have accepted the shares proposal.
              </div>
            </div>
          )}
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
