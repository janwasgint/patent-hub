import React, { Component } from "react";
import PropTypes from "prop-types";
import Blockies from "react-blockies";

class DrawingsList extends Component {
  render() {
    const props = this.props;
    return (
      <div>
        {this.props.events && this.props.events.length ? (
          <ul className="list-unstyled">
            {this.props.events.map(function(event, i) {
              return (
                <li className="media align-middle" key={i}>
                  <Blockies seed={event.drawer} size={10} scale={10} />
                  <div className="media-body">
                    <h5 className="align-middle m-2">
                      {props.mapNameToAddress(event.drawer)}
                    </h5>

                    <p className="align-middle m-2">
                      <span className="badge badge-secondary">File hash</span>{" "}
                      {event.drawingsIpfsFileHash}
                      <button
                        type="button"
                        className="form-control btn btn-secondary"
                        onClick={() => props.downloadPdf(event.drawingsIpfsFileHash)}
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
          <div>No drawings yet!</div>
        )}
      </div>
    );
  }
}

DrawingsList.contextTypes = {
  drizzle: PropTypes.object
};

export default DrawingsList;
