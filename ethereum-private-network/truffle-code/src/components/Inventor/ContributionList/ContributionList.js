import React, { Component } from "react";
import PropTypes from "prop-types";
import Blockies from "react-blockies";

class ContributionList extends Component {
  constructor(props) {
    super(props);

    this.state = { contributionAddedSuccessfully: [] };

    this.fetchContribution();
  }

  fetchContribution() {
    var propsEvents = this.props.propsEvents;
    var tempContributionAddedSuccessfully = [];

    // iterate all events to get the one we are interested in - contributionAddedSuccessfully(address indexed inventor, string ipfsFileHash)
    // for events parameteres see PatentHub.sol
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === "contributionAddedSuccessfully") {
        tempContributionAddedSuccessfully.push({
          inventor: propsEvents[i].returnValues.inventor,
          ipfsFileHash: propsEvents[i].returnValues.ipfsFileHash
        });
      }
    }
    if (
      this.state.contributionAddedSuccessfully.length !=
      tempContributionAddedSuccessfully.length
    ) {
      this.state.contributionAddedSuccessfully = tempContributionAddedSuccessfully;
    }
  }

  render() {
    this.fetchContribution();

    let props = this.props;

    return (
      <div>
        {this.state.contributionAddedSuccessfully &&
        this.state.contributionAddedSuccessfully.length ? (
          <ul className="list-unstyled">
            {this.state.contributionAddedSuccessfully.map(function(event, i) {
              return (
                <li className="media align-middle" key={i}>
                  <Blockies seed={event.inventor} size={10} scale={10} />
                  <div className="media-body">
                    <h5 className="align-middle m-2">
                      {props.mapNameToAddress(event.inventor)}
                    </h5>

                    <p className="align-middle m-2">
                      <span className="badge badge-secondary">File hash</span>{" "}
                      {event.ipfsFileHash}
                      <button
                        type="button"
                        className="form-control btn btn-secondary"
                        onClick={() => props.downloadPdf(event.ipfsFileHash)}
                      >
                        Download File
                      </button>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div>No contributions yet!</div>
        )}
      </div>
    );
  }
}

ContributionList.contextTypes = {
  drizzle: PropTypes.object
};

export default ContributionList;
