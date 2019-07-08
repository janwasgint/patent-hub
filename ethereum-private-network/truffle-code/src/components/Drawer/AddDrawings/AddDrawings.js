import React, { Component } from "react";
import PropTypes from "prop-types";

import { getContract } from "./../../../utils/MyContracts.js";
import { ipfsApi, alertEnabled } from "../../shared.js";

class AddDrawings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      added_file_hash: "",
      value: ""
    };
    
    // bind methods
    this.captureFile = this.captureFile.bind(this);
    this.saveToIpfs = this.saveToIpfs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  onClick = e => {
    const self = this;
    var ipfsId = self.state.added_file_hash;
    console.log(ipfsId);

    var account = "";
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Could not get accounts!");
      account = result[0];
    });

    getContract(this.context.drizzle)
      .then(function(instance) {
        console.log("Sending filehash to contract...");
        console.log("Add drawings account", account);
        return instance.setDrawings(ipfsId, {
          from: account
        });
      })
      .then(function(result) {
        if (alertEnabled) { alert(
          "Drawings added successfully! Transaction Hash: " +
            result.tx +
            "\nIpfs File Hash: " +
            ipfsId
        ); }
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  };

  saveToIpfs(reader, event) {
    let ipfsId;
    const buffer = Buffer.from(reader.result);
    ipfsApi
      .add(buffer, {
        progress: prog => console.log(`received: ${prog}`)
      })
      .then(response => {
        console.log(response);
        ipfsId = response[0].hash;
        console.log(ipfsId);
        this.setState({
          added_file_hash: ipfsId
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  captureFile(event) {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.onloadend = () => this.saveToIpfs(reader, event);
    reader.readAsArrayBuffer(file);
    this.handleChange(event);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="form-group">
        <form id="captureMedia" onSubmit={this.handleSubmit}>
          <input type="file" onChange={this.captureFile} />{" "}
        </form>{" "}
        <label onChange={this.handleChange} htmlFor="ipfsHash">
          {" "}
          {this.state.added_file_hash}{" "}
        </label>
        <p />
        <button
          type="button"
          className="form-control btn btn-primary"
          onClick={this.onClick}
        >
          Send{" "}
        </button>{" "}
      </div>
    );
  }
}

AddDrawings.contextTypes = {
  drizzle: PropTypes.object
};

export default AddDrawings;
