import React, { Component } from "react";
import PropTypes from "prop-types";

import { getContract } from "./../../../utils/MyContracts.js";
import { nationalizerAddress, ipfsApi, alertEnabled } from "../../shared.js";

class PatentDraft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      added_file_hash: "",
      value: ""
    };

    // bind methods
    this.captureFile = this.captureFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.patentDraftFields = this.patentDraftFields.bind(this)
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

  captureFile(event) {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.onloadend = () => this.saveToIpfs(reader, event);
    reader.readAsArrayBuffer(file);
    this.handleChange(event);
  }

  draftSections = [
    "Jurisdiction",
    "Claims",
    "Detailed Description",
    "Background",
    "Abstract",
    "Summary"
  ];

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

    let jurisdiction = e.target[0].value;
    let claimsText = e.target[1].value;
    let detailedDescriptionText = e.target[2].value;
    let backgroundText = e.target[3].value;
    let abstractText = e.target[4].value;
    let summaryText = e.target[5].value;

    getContract(this.context.drizzle)
      .then(function(instance) {
        console.log("Sending draft to contract...");
        console.log("account", account);

        return instance.setNationalizedDraft(nationalizerAddress, jurisdiction, claimsText, detailedDescriptionText, backgroundText, abstractText, summaryText, "", {
          from: account
        });
      })
      .then(function(result) {
        if (alertEnabled) { alert(
          "Draft sent successfully! Transaction Hash: " +
            result.tx
        ); }
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  };

  patentDraftFields() {
    let draftSection = [];
    let defaultText = [];
    let e = this.events.patentDraftUpdated[this.events.patentDraftUpdated.length - 1]
    defaultText.push((e === undefined) ? undefined : e.jurisdiction)
    defaultText.push((e === undefined) ? undefined : e.claimsText)
    defaultText.push((e === undefined) ? undefined : e.detailedDescriptionText)
    defaultText.push((e === undefined) ? undefined : e.backgroundText)
    defaultText.push((e === undefined) ? undefined : e.abstractText)
    defaultText.push((e === undefined) ? undefined : e.summaryText)

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
              defaultValue={(defaultText[i] === undefined) ? "" : defaultText[i]}
            ></textarea>
          </div>
        </div>
      );
    }
    return draftSection;
  }

  render() {
    this.events = {
      patentDraftUpdated: [],
    };

    // fetch all events we have to listen to from the contract
    let propsEvents = this.props.PatentHub.events;

    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === "patentDraftUpdated") {      
        this.events.patentDraftUpdated.push({
          jurisdiction: propsEvents[i].returnValues.jurisdiction,
          claimsText: propsEvents[i].returnValues.claimsText,
          detailedDescriptionText: propsEvents[i].returnValues.detailedDescriptionText,
          backgroundText: propsEvents[i].returnValues.backgroundText,
          abstractText: propsEvents[i].returnValues.abstractText,
          summaryText: propsEvents[i].returnValues.summaryText,
        });    
      }
    } 

    var events = this.props.events;
    return (
      <div className="form-group">
        <form id="captureMedia" onSubmit={this.handleSubmit}>
          {this.patentDraftFields()}
            <p />
            
            <button type="submit" className="form-control btn btn-primary">
              Send
            </button>
        </form>
      </div>
    );
  }
}

PatentDraft.contextTypes = {
  drizzle: PropTypes.object
};

export default PatentDraft;
