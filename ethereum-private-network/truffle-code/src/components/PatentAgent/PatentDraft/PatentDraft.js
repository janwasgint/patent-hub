import React, { Component } from "react";
import PropTypes from "prop-types";
const ipfsAPI = require("ipfs-api");

class PatentDraft extends Component {
  constructor(props) {
    super(props);

    this.state = {
      added_file_hash: "",
      value: ""
    };
    //this.ipfsApi = ipfsAPI('localhost', '5001');host: '1.1.1.1', port: '80'
    this.ipfsApi = ipfsAPI("localhost", 5001, "https");

    // bind methods
    this.captureFile = this.captureFile.bind(this);
  }

  draftSections = [
    "Claims",
    "Detailed Description",
    "Background",
    "Abstract",
    "Summary"
  ];

  captureFile(event) {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.onloadend = () => this.saveToIpfs(reader, event);
    reader.readAsArrayBuffer(file);
  }

  patentDraftFields() {
    let draftSection = [];
    for (var i = 0; i < this.draftSections.length; i++) {
      draftSection.push(
        <div key={i}>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text"> {this.draftSections[i]}</span>
            </div>
            <textarea
              className="form-control"
              aria-label="With textarea"
            ></textarea>
          </div>
        </div>
      );
    }
    return draftSection;
  }

  render() {
    var events = this.props.events;
    return (
      <div className="form-group">
        <form id="captureMedia" onSubmit={this.handleSubmit}>
          {this.patentDraftFields()}
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Drawings </span>{" "}
            </div>
            <input type="file" className="m-2" onChange={this.captureFile} />{" "}
          </div>
        </form>
      </div>
    );
  }
}

PatentDraft.contextTypes = {
  drizzle: PropTypes.object
};

export default PatentDraft;
