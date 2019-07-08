import React, { Component } from "react";
import PropTypes from "prop-types";

import PatentDraftContainer from "./PatentDraft/PatentDraftContainer";
import DrawingsList from "./DrawingsList/DrawingsList";

import { getContract } from "./../../utils/MyContracts.js";
import { drawerAddress, nationalizerAddress, mapNameToAddress, ipfsApi, downloadPdf, enableAlert } from "../shared.js";

class PatentOffice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      added_file_hash: "",
      value: "",
      showFeeRequest: true,
      showAcceptPatent: true,
    };

    // bind methods
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.downloadPdf = downloadPdf.bind(this);
    this.approvePatent = this.approvePatent.bind(this)
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
        return instance.uploadContract("patentOffice", nationalizerAddress, "nationalizer", payment, "", {
          from: account
        });
      })
      .then(function(result) {
        if (enableAlert) { alert(
          "Payment request sent successfully! Transaction Hash: " +
            result.tx
        ); }
        console.log(result);
      }) 
      .catch(function(err) {
        console.log(err.message);
      });
  };

  approvePatent() {
    var account = "";
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Could not get accounts!");
      account = result[0];
    });

    getContract(this.context.drizzle)
      .then(function(instance) {
        return instance.acceptNationalPatent({
          from: account
        });
      })
      .then(function(result) {
        if (enableAlert) { alert("Patent approved successfully! Transaction Hash: " + result.tx); }
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });    
  }

  // Not implemented in the contract yet
  rejectPatent() {
    console.log("rejected");
  }

  render() {
    // local copy of the events we are interested in
    this.events = {
      feePaid: [],
      patentDraftUpdated: [],
      nationalPatentAccepted: []
    };

    // fetch all events we have to listen to from the contract
    let propsEvents = this.props.PatentHub.events;
    
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === "feePaid") {
        this.events.feePaid.push({
          status: true
        });
        this.state.showFeeRequest = false;
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

    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === "nationalPatentAccepted") {
        this.events.nationalPatentAccepted.push({
          status: true
        });
        this.state.showAcceptPatent = false;
      }
    }

    return (
        <div>
        {this.state.showFeeRequest &&
          <div>
            <div className="card">
              <h5 className="card-header"> Fee for Nationalizer </h5>
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
                    <button type="submit" className="form-control btn btn-primary">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        }

        {!this.state.showFeeRequest &&
          <div>
            <div className="card">
              <h5 className="card-header"> Nationalized Patent Draft </h5>
              <div className="card-body">
                <PatentDraftContainer />
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

            <p />

            {this.state.showAcceptPatent && (
              <div className="card-header">
                <form>
                  <div className="row">
                    <div className="col">
                      <button
                        type="button"
                        className="form-control btn btn-success"
                        onClick={this.approvePatent}
                      >
                        Approve
                      </button>
                    </div>
                    <div className="col">
                      <button
                        type="button"
                        className="form-control btn btn-danger"
                        onClick={this.rejectPatent}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {!this.state.showAcceptPatent && (
              <div>
                <div className="alert alert-success" role="alert">
                  Patent approved!
                </div>
              </div>
            )}       
          </div>
        }
        </div>
    );
  }
}

PatentOffice.contextTypes = {
  drizzle: PropTypes.object
};

export default PatentOffice;
