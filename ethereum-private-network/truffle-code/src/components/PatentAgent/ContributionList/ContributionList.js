import React, { Component } from "react";
import PropTypes from "prop-types";
import Blockies from "react-blockies";

class ContributionList extends Component {
  render() {
    const props = this.props;
    return (
      <div>
        {this.props.events && this.props.events.length ? (
          <ul className="list-unstyled">
            {this.props.events.map(function(event, i) {
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
