import React, { Component } from "react";
import PropTypes from "prop-types";

import ContributionList from "./ContributionList/ContributionList";
import SalaryProposal from "./SalaryProposal/SalaryProposal";
import PatentDraftContainer from "./PatentDraft/PatentDraftContainer";

import { getContract } from "./../../utils/MyContracts.js";
import { drawerAddress, nationalizerAddress, mapNameToAddress, ipfsApi } from "../shared.js";

class PatentAgent extends Component {
  constructor(props) {
    super(props);

    // event approveContractRequest(address indexed proposerAddress, string proposerPersona, address indexed approverAddress, string approverPersona, uint payment, string ipfsFileHash);
    this.state = {
      added_file_hash: "",
      value: "",
      showContractRequest: true,
      showAcceptDrawerContract: true,
      showAcceptNationalizerContract: true
    };
     
    // bind methods
    this.acceptDrawerPaymentProposal = this.acceptDrawerPaymentProposal.bind(this);
    this.acceptNationalizerPaymentProposal = this.acceptNationalizerPaymentProposal.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.saveToIpfs = this.saveToIpfs.bind(this);
    this.downloadPdf = this.downloadPdf.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);


    // local copy of the events we are interested in
    this.events = {
      contributionAddedSuccessfully: [],
      patentAgentInventorsContractApproved: [],
      approveDrawerContractRequest: [],
      approveNationalizerContractRequest: [],
      drawerContractApproved: [],
      nationalizerContractApproved: [],
    };

    // fetch all events we have to listen to from the contract
    let propsEvents = this.props.PatentHub.events;

    // iterate all events to get the one we are interested in - contributionAddedSuccessfully(address indexed inventor, string ipfsFileHash)
    // for events parameteres see PatentHub.sol
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === "contributionAddedSuccessfully") {
        this.events.contributionAddedSuccessfully.push({
          inventor: propsEvents[i].returnValues.inventor,
          ipfsFileHash: propsEvents[i].returnValues.ipfsFileHash
        });
      }
    }
  
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === "patentAgentInventorsContractApproved") {
        this.events.patentAgentInventorsContractApproved.push({
          status: true,
        });
        this.state.showContractRequest = false;
      }
    }

	  // emit approveContractRequest(ddress indexed proposerAddress, persona, approverAddress, approverPersona, payment, ipfsFileHash);
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === "approveContractRequest") {
        //console.log(propsEvents[i].event)
        //console.log(propsEvents[i].returnValues.proposerPersona)
        if (propsEvents[i].returnValues.proposerPersona == "drawer") {
          this.events.approveDrawerContractRequest.push({
            proposer: propsEvents[i].returnValues.proposerAddress,
            ipfsFileHash: propsEvents[i].returnValues.ipfsFileHash,
            payment: propsEvents[i].returnValues.payment
          });
        }
        else if (propsEvents[i].returnValues.proposerPersona == "nationalizer") {
          this.events.approveNationalizerContractRequest.push({
            proposer: propsEvents[i].returnValues.proposerAddress,
            ipfsFileHash: propsEvents[i].returnValues.ipfsFileHash,
            payment: propsEvents[i].returnValues.payment
          });
        }
      }
    }
	    
    // emit contractApproved(proposerAddress, contr.proposerPersona, msg.sender, contr.approverPersona, contr.ipfsFileHash);
    for (var i = 0; i < propsEvents.length; i++) {
        if (propsEvents[i].event === "contractApproved") {
          if (propsEvents[i].returnValues.proposerPersona == "drawer") {
            this.events.drawerContractApproved.push({
              proposer: propsEvents[i].returnValues.proposerAddress,
              ipfsFileHash: propsEvents[i].returnValues.ipfsFileHash,
              payment: propsEvents[i].returnValues.payment
            });
            this.state.showAcceptDrawerContract = false;
          }
          else if (propsEvents[i].returnValues.proposerPersona == "nationalizer") {
            this.events.nationalizerContractApproved.push({
              proposer: propsEvents[i].returnValues.proposerAddress,
              ipfsFileHash: propsEvents[i].returnValues.ipfsFileHash,
              payment: propsEvents[i].returnValues.payment
            });
            this.state.showAcceptNationalizerContract = false;
          }
        }
      }
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
  }

  downloadPdf() {
    ipfsApi.get(this.state.added_file_hash, function(err, files) {
      files.forEach(file => {
        console.log(file.path);
        console.log(file.content.toString("utf8"));
      });
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

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  acceptDrawerPaymentProposal() {
    var account = "";
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Could not get accounts!");
      account = result[0];
    });

    let addr = drawerAddress

    getContract(this.context.drizzle)
      .then(function(instance) {
        return instance.approveContract(addr, {
          from: account
        });
      })
      .then(function(result) {
        alert("Contract and payment approved successfully! Transaction Hash: " + result.tx);
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });    
  }

  acceptNationalizerPaymentProposal() {
    var account = "";
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Could not get accounts!");
      account = result[0];
    });

    let addr = nationalizerAddress

    getContract(this.context.drizzle)
      .then(function(instance) {
        return instance.approveContract(addr, {
          from: account
        });
      })
      .then(function(result) {
        alert("Payment and contract approved successfully! Transaction Hash: " + result.tx);
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });    

  }

  // Not implemented in the contract yet
  rejectPaymentProposal() {
    console.log("rejected");
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
          "Contract sent successfully! Transaction Hash: " +
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

  render() {
    return (
      <div>
        {this.state.showContractRequest &&
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
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        }
        {!this.state.showContractRequest &&
          <div className="card">
            <h5 className="card-header"> Contribution List </h5>
            <div className="card-body">
              <ContributionList
                events={this.events.contributionAddedSuccessfully}
                downloadPdf={this.downloadPdf}
                mapNameToAddress={address => mapNameToAddress(address)}
              />
            </div>
          </div>
        }

        <p />

        <div className="card">
          <h5 className="card-header"> Drawer </h5>
          <div className="card-body">
            <SalaryProposal
              events={this.events.approveDrawerContractRequest}
              acceptPaymentProposal={this.acceptDrawerPaymentProposal}
              rejectPaymentProposal={this.rejectPaymentProposal}
              showAcceptProposal={this.state.showAcceptDrawerContract}
              mapNameToAddress={address => mapNameToAddress(address)}
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
              events={this.events.approveNationalizerContractRequest}
              acceptPaymentProposal={this.acceptNationalizerPaymentProposal}
              rejectPaymentProposal={this.rejectPaymentProposal}
              showAcceptProposal={this.state.showAcceptNationalizerContract}
              mapNameToAddress={address => mapNameToAddress(address)}
              downloadPdf={this.downloadPdf}
              actor={"Nationalizer"}
            />
          </div>
        </div>

        <p />

        <div className="card">
          <h5 className="card-header"> Patent Draft </h5>
          <div className="card-body">
            <PatentDraftContainer />
          </div>
        </div>
      </div>
    );
  }
}

PatentAgent.contextTypes = {
  drizzle: PropTypes.object
};

export default PatentAgent;
