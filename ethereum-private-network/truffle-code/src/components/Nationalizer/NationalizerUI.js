import React, { Component } from "react";
import PropTypes from "prop-types";
const ipfsAPI = require("ipfs-api");

import { getContract } from "./../../utils/MyContracts.js";

class NationalizerUI extends Component {
  constructor(props) {
    super(props);

    this.ipfsApi = ipfsAPI("localhost", 5001, "https");

    // local copy of the events we are interested in
    this.events = {};
    this.state = {
      added_file_hash: "",
      value: ""
    };
    //this.ipfsApi = ipfsAPI('localhost', '5001');host: '1.1.1.1', port: '80'
    this.ipfsApi = ipfsAPI("localhost", 5001, "https");

    // bind methods
    this.captureFile = this.captureFile.bind(this);
    this.saveToIpfs = this.saveToIpfs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    // fetch all events we have to listen to from the contract
    let propsEvents = this.props.PatentHub.events;
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
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

  saveToIpfs(reader, event) {
    let ipfsId;
    const buffer = Buffer.from(reader.result);
    this.ipfsApi
      .add(buffer, { progress: prog => console.log(`received: ${prog}`) })
      .then(response => {
        console.log(response);
        ipfsId = response[0].hash;
        console.log(ipfsId);
        this.setState({ added_file_hash: ipfsId });
      })
      .catch(err => {
        console.error(err);
      });
  }

  handleSubmit = e => {
    e.preventDefault();
    const self = this;
    var ipfsId = self.state.added_file_hash;
    console.log(ipfsId);

    var account = "";
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Could not get accounts!");
      account = result[0];
    });

    let payment = e.target[0].value;

    getContract(this.context.drizzle)
      .then(function(instance) {
        console.log("Sending filehash to contract...");
        console.log("account", account);

        // @Luca Todo: Set correct function
        return instance.uploadInventorsContract(payment, ipfsId, {
          from: account
        });
      })
      .then(function(result) {
        alert(
          "Contract sent succesfully! Transaction Hash: " +
            result.tx +
            "\nIpfs File Hash: " +
            ipfsId
        );
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  };

  sendTo() {
    console.log("Hello");
  }

  render() {
    return (
      <div>
        <div className="card">
          <h5 className="card-header"> Contract For Patent Agent </h5>
          <div className="card-body">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="payment">Requested payment</label>
                <input
                  required="true"
                  type="number"
                  className="form-control"
                  placeholder="0,00€"
                />
              </div>
              <div className="form-group">
                <label htmlFor="Contract">Contract</label>
                <br />
                <input type="file" onChange={this.captureFile} />
                <label htmlFor="ipfsHash">{this.state.added_file_hash}</label>
                <p />
                <button type="submit" className="form-control btn btn-primary">
                  Send to Patent Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

NationalizerUI.contextTypes = {
  drizzle: PropTypes.object
};

export default NationalizerUI;
