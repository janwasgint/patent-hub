import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getContract } from './../../util/MyContracts.js';

const ipfsAPI = require('ipfs-api');
const pdfjsLib = require('pdfjs-dist');

class UploadContract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      added_file_hash: null,
      value: ''
    };
    this.ipfsApi = ipfsAPI('localhost', '4432');

    // bind methods
    this.captureFile = this.captureFile.bind(this);
    this.saveToIpfs = this.saveToIpfs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderPdf = this.renderPdf.bind(this);
    this.getFileContent = this.getFileContent.bind(this);
    this.clearPdf = this.clearPdf.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
  }

  saveToIpfs(reader, event) {
    let ipfsId;
    const buffer = Buffer.from(reader.result);
    this.ipfsApi
      .add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
      .then((response) => {
        console.log(response);
        ipfsId = response[0].hash;
        console.log(ipfsId);
        this.setState({ added_file_hash: ipfsId });
        //this.getFileContent();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getFileContent() {
    const self = this;
    this.ipfsApi.cat(this.state.added_file_hash, function(err, file) {
      if (err) {
        throw err;
      }
      console.log(file.toString('base64'));
      self.setState({ file_content: file.toString('base64') });

      //self.renderPdf()
    });
  }

  onClick = (e) => {
    const self = this;
    var ipfsId = self.state.added_file_hash;
    console.log(ipfsId);

    var account = '';
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Couldn't get accounts");
      account = result[0];
    });

    var employeeAddr = self.state.value;
    console.log(employeeAddr);

    getContract(this.context.drizzle)
      .then(function(instance) {
        console.log('Sending filehash to contract');
        return instance.uploadContract(employeeAddr, ipfsId, { from: account });
      })
      .then(function(result) {
        alert('Contract Uploaded Successfully! Transaction Hash: ' + result.tx + '\nIpfs File Hash: ' + ipfsId);
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  };

  handleSubmit(event) {
    event.preventDefault();
  }

  clearPdf() {
    var canvas = document.getElementById('the-canvas');
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.height = 2;
    canvas.width = 0;
    //context.restore();
  }

  renderPdf(fileHash) {
    this.setState({ added_file_hash: fileHash });
    this.getFileContent();
    var pdfData = atob(this.state.file_content);

    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    //var pdfjsLib = window['pdfjs-dist/build/pdf'];

    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = '../../build/browserify/pdf.worker.bundle.js';

    // Using DocumentInitParameters object to load binary data.
    var loadingTask = pdfjsLib.getDocument({ data: pdfData });
    loadingTask.promise.then(
      function(pdf) {
        console.log('PDF loaded');

        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function(page) {
          console.log('Page loaded');

          var scale = 1.5;
          var viewport = page.getViewport(scale);

          // Prepare canvas using PDF page dimensions
          var canvas = document.getElementById('the-canvas');
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          renderTask.then(function() {
            console.log('Page rendered');
          });
        });
      },
      function(reason) {
        // PDF loading error
        console.error(reason);
      }
    );
  }

  render() {
    return (
      <div>
        <form id="captureMedia" onSubmit={this.handleSubmit}>
          <input type="file" onChange={this.captureFile} />
        </form>

        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <button onClick={this.onClick}>Send</button>
        <canvas width="2" height="2" id="the-canvas2" />
        <br />
        <br />
        <div className="row">
          <button className="button" onClick={this.clearPdf}>
            Clear
          </button>
        </div>
      </div>
    );
  }
}

UploadContract.contextTypes = {
  drizzle: PropTypes.object
};

export default UploadContract;
