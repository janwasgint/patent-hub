import React, { Component } from "react";
import PropTypes from "prop-types";
import Blockies from "react-blockies";

import { getContract } from "./../../../utils/MyContracts.js";

const ipfsAPI = require("ipfs-api");
const pdfjsLib = require("pdfjs-dist");

class ContributionList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ul className="list-unstyled">
          {this.props.events.map(function(event, i) {
            return (
              <li className="media" key={i}>
                <Blockies seed={event.inventor} size={10} scale={10} />
                <div className="media-body">
                  <h5 className="m-3">Inventor: {event.inventor}</h5>
                  <p className="m-3">File hash: {event.ipfsFileHash}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

ContributionList.contextTypes = {
  drizzle: PropTypes.object
};

export default ContributionList;
