import React, { Component } from "react";
import PropTypes from "prop-types";
import Blockies from "react-blockies";

class ContributionList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    return (
      <div>
        {this.props.events && this.props.events.length ? (
          <ul className="list-unstyled">
            {this.props.events.map(function(event, i) {
              return (
                <li className="media" key={i}>
                  <Blockies seed={event.inventor} size={10} scale={10} />
                  <div className="media-body">
                    <h5 className="m-3">
                      {props.mapNameToAddress(event.inventor)}: {event.inventor}
                    </h5>
                    <p className="m-3">File hash: {event.ipfsFileHash}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div>Nothing has been contributed</div>
        )}
      </div>
    );
  }
}

ContributionList.contextTypes = {
  drizzle: PropTypes.object
};

export default ContributionList;
