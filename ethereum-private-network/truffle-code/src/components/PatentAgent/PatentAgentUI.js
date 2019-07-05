import React, { Component } from "react";
import PropTypes from "prop-types";
const ipfsAPI = require("ipfs-api");

import SalaryProposal from "./SalaryProposal/SalaryProposal";
import PatentDraft from "./PatentDraft/PatentDraft";

import { getContract } from "./../../utils/MyContracts.js";

class PatentAgentUI extends Component {
  constructor(props) {
    super(props);

    this.ipfsApi = ipfsAPI("localhost", 5001, "https");

    this.downloadPdf = this.downloadPdf.bind(this);

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

  inventorAndAddress = [
    { address: "0x5764e7337dfae66f5ac5551ebb77307709fb0219", name: "Jan" },
    { address: "0x11c2e86ebecf701c265f6d19036ec90d277dd2b3", name: "Luca" },
    { address: "0xc33a1d62e6de00d4c9b135718280411101bcb9dd", name: "Korbi" },
    { address: "0x01edfe893343e51f89b323c702e21868109bbf1f", name: "Goofy" },
    { address: "0x298bd2bd1aab49b7a8bb0943ab972bd53b084f09", name: "Donald" },
    { address: "0x95057ead904141f497cdbad7714b295e12f8c48a", name: "Mickey" }
  ];

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  acceptPaymentProposal() {
    console.log("accepted");
  }

  rejectPaymentProposal() {
    console.log("rejected");
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

  downloadPdf(ipfsFileHash) {
    this.ipfsApi.get(ipfsFileHash, function(err, files) {
      files.forEach(file => {
        console.log(file.path);
        console.log(file.content.toString("utf8"));
      });
    });
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

  mapNameToAddress(address) {
    var inventorName;
    this.inventorAndAddress.forEach(inventor => {
      if (inventor.address.toUpperCase() === address.toUpperCase()) {
        inventorName = inventor.name;
      }
    });

    return inventorName;
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

  thirdParties = [
    "Drawer",
    "Nationalizer",
    "Translator",
    "Patent Office",
    "Inventors"
  ];

  sendTo() {
    console.log("Hello");
  }

  render() {
    return (
      <div>
        <div className="card">
          <h5 className="card-header"> Contract For Inventors </h5>
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
                  Send to inventors
                </button>
              </div>
            </form>
          </div>
        </div>
        <p />

        <div className="card">
          <h5 className="card-header"> Drawer </h5>
          <div className="card-body">
            <SalaryProposal
              events={this.events.approvePatentAgentContractRequest}
              acceptPaymentProposal={this.acceptPaymentProposal}
              rejectPaymentProposal={this.rejectPaymentProposal}
              mapNameToAddress={address => this.mapNameToAddress(address)}
              downloadPdf={this.downloadPdf}
              actor={"Drawer"}
            />
          </div>
        </div>
        <p />

        <div className="card">
          <h5 className="card-header"> Nationalizer </h5>
          <div className="card-body">
            <SalaryProposal
              events={this.events.approvePatentAgentContractRequest}
              acceptPaymentProposal={this.acceptPaymentProposal}
              rejectPaymentProposal={this.rejectPaymentProposal}
              mapNameToAddress={address => this.mapNameToAddress(address)}
              downloadPdf={this.downloadPdf}
              actor={"Nationalizer"}
            />
          </div>
        </div>

        <p />

        <div className="card">
          <h5 className="card-header"> Patent Draft </h5>
          <div className="card-body">
            <PatentDraft />
          </div>
        </div>
      </div>
    );
  }
}

PatentAgentUI.contextTypes = {
  drizzle: PropTypes.object
};

export default PatentAgentUI;
