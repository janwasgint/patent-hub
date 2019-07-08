import React, { Component } from "react";
import PropTypes from "prop-types";

import PatentDraftContainer from "./PatentDraft/PatentDraftContainer";
import AddDrawingsContainer from "./AddDrawings/AddDrawingsContainer";
import DrawingsList from "./DrawingsList/DrawingsList";

import { getContract } from "./../../utils/MyContracts.js";
import { patentAgentAddress, drawerAddress, nationalizerAddress, actorsAndAddress, mapNameToAddress, ipfsApi, downloadPdf, alertEnabled } from "../shared.js";

class Drawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      added_file_hash: "",
      value: "",
      showContractRequest: true,
    };

    // bind methods
    this.captureFile = this.captureFile.bind(this);
    this.saveToIpfs = this.saveToIpfs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.downloadPdf = downloadPdf.bind(this);    
  }

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
  };

  captureFile(event) {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.onloadend = () => this.saveToIpfs(reader, event);
    reader.readAsArrayBuffer(file);
    this.handleChange(event);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
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

        // function uploadContract(string memory persona, address approverAddress, string memory approverPersona, uint payment, string memory ipfsFileHash) 
        return instance.uploadContract("drawer", patentAgentAddress, "patentAgent", payment, ipfsId, {
          from: account
        });
      })
      .then(function(result) {
        if (alertEnabled) { alert(
          "Contract sent successfully! Transaction Hash: " +
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

  render() {
    // local copy of the events we are interested in
    this.events = {
      drawerContractApproved: [],
      patentDraftUpdated: [],
    };

    // fetch all events we have to listen to from the contract
    let propsEvents = this.props.PatentHub.events;
    
    // emit contractApproved(proposerAddress, contr.proposerPersona, msg.sender, contr.approverPersona, contr.ipfsFileHash);
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === "contractApproved") {
        if (propsEvents[i].returnValues.proposerPersona == "drawer") {
          this.events.drawerContractApproved.push({
            status: true
          });
          this.state.showContractRequest = false;
        }
      }
    }

   for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === "patentDraftUpdated") {
        if (propsEvents[i].returnValues.drawingsIpfsFileHash != "") {
          if (this.events.patentDraftUpdated == 0) {
            this.events.patentDraftUpdated.push({
              drawer: drawerAddress,
              drawingsIpfsFileHash: propsEvents[i].returnValues.drawingsIpfsFileHash,
            });
          }
        }
      }
    }
    return (
        <div>
        {this.state.showContractRequest &&
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
                    <input type="file" onChange={this.captureFile}/>
                    <label htmlFor="ipfsHash">{this.state.added_file_hash}</label>
                    <p />
                    <button type="submit" className="form-control btn btn-primary">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        }

        {!this.state.showContractRequest &&
          <div>
            <div className="card">
              <h5 className="card-header"> Patent Draft </h5>
              <div className="card-body">
                <PatentDraftContainer />
              </div>
            </div>
         
            <p />

            <div className="card">
              <h5 className="card-header"> Upload Drawings </h5>
              <div className="card-body">
                <AddDrawingsContainer />
              </div>
            </div>

            <p />

            <div className="card">
              <h5 className="card-header"> Drawings List </h5>
              <div className="card-body">
                <DrawingsList
                  events={this.events.patentDraftUpdated}
                  downloadPdf={this.downloadPdf}
                  mapNameToAddress={address => mapNameToAddress(address)}
                />
              </div>
            </div>
         
          </div>
        }
        </div>
    );
  }
}

Drawer.contextTypes = {
  drizzle: PropTypes.object
};

export default Drawer;
