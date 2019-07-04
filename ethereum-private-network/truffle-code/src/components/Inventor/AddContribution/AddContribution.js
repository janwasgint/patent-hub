import React, {
  Component
} from "react";
import PropTypes from "prop-types";

import {
  getContract
} from "./../../../utils/MyContracts.js";

const ipfsAPI = require("ipfs-api");
const pdfjsLib = require("pdfjs-dist");

class AddContribution extends Component {
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
    this.saveToIpfs = this.saveToIpfs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  captureFile(event) {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.onloadend = () => this.saveToIpfs(reader, event);
    reader.readAsArrayBuffer(file);
  }

  saveToIpfs(reader, event) {
    let ipfsId;
    const buffer = Buffer.from(reader.result);
    this.ipfsApi
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
    this.ipfsApi.get(this.state.added_file_hash, function(err, files) {
      files.forEach(file => {
        console.log(file.path);
        console.log(file.content.toString("utf8"));
      });
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

    var inventorAddr = self.state.value;

    getContract(this.context.drizzle)
      .then(function(instance) {
        console.log("Sending filehash to contract...");
        console.log("Add contribution account", account);
        return instance.addContribution(ipfsId, {
          from: account
        });
      })
      .then(function(result) {
        alert(
          "Contribution added successfully! Transaction Hash: " +
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

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return ( <
      div className = "form-group" >
      <
      form id = "captureMedia"
      onSubmit = {
        this.handleSubmit
      } >
      <
      input type = "file"
      onChange = {
        this.captureFile
      }
      /> <
      /form> <
      label onChange = {
        this.handleChange
      }
      htmlFor = "ipfsHash" > {
        this.state.added_file_hash
      } < /label>

      <
      p / >
      <
      button type = "button"
      className = "form-control btn btn-primary"
      onClick = {
        this.onClick
      } >
      Send <
      /button> <
      /div>
    );
  }
}

AddContribution.contextTypes = {
  drizzle: PropTypes.object
};

export default AddContribution;