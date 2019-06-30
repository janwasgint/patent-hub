import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';
import { keyMappings } from './../../const.js';
import { getContract } from './../../util/MyContracts.js';

const util = require('ethereumjs-util');
const ecies = require('eth-ecies');
const pdfjsLib = require('pdfjs-dist');
const ipfsAPI = require('ipfs-api');
const driver = require('bigchaindb-driver');

function encrypt(publicKey, data) {
  let userPublicKey = new Buffer(publicKey, 'hex');
  let bufferData = new Buffer(data);
  let encryptedData = ecies.encrypt(userPublicKey, bufferData);
  return encryptedData.toString('base64');
}

function decrypt(usr, encryptedData) {
  let priv = new Buffer(usr, 'hex');
  let bufferEncryptedData = new Buffer(encryptedData, 'base64');
  let decryptedData = ecies.decrypt(priv, bufferEncryptedData);
  return decryptedData.toString('utf8');
}

class Events extends Component {
  constructor(props) {
    super(props);
    this.ipfsApi = ipfsAPI('localhost', '4432');
    this.conn = new driver.Connection('https://test.bigchaindb.com/api/v1/', {
      app_id: '7e55e3b9',
      app_key: 'ee2dec089f59beecb9aa688d3ed3ee2b'
    });
    this.ha = new driver.Ed25519Keypair();

    this.employerChange = this.employerChange.bind(this);
    this.haDataLandlordChange = this.haDataLandlordChange.bind(this);
    this.haDataEmployeeChange = this.haDataEmployeeChange.bind(this);
    this.haDataDateChange = this.haDataDateChange.bind(this);
    this.haChange = this.haChange.bind(this);
    this.renderPdf = this.renderPdf.bind(this);

    var events = {
      employeeLegitimises: [],
      dataRequestInitiated: [],
      approveContractRequest: [],
      approveContractResponse: [],
      updateHA: [],
      verificationRequest: [],
      verificationResponse: []
    };

    let propsEvents = this.props.PatentHub.events;
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === 'employeeLegitimises' && propsEvents[i].returnValues.landlord === props.accounts[0]) {
        var data = decrypt(keyMappings[this.props.accounts[0].toLowerCase()].substr(2), propsEvents[i].returnValues[2]);
        data = JSON.parse(data);
        events.employeeLegitimises.push({
          employee: propsEvents[i].returnValues.employee,
          landlord: propsEvents[i].returnValues.landlord,
          employer: data.Employer,
          bank: data.Bank,
          housingAuthority: data.HousingAuthority,
          insuranceProvider: data.InsuranceProvider,
          police: data.Police
        });
      } else if (propsEvents[i].event === 'dataRequestInitiated' && propsEvents[i].returnValues.employee === props.accounts[0]) {
        events.dataRequestInitiated.push({
          landlord: propsEvents[i].returnValues.landlord
        });
      } else if (propsEvents[i].event === 'approveContractRequest' && propsEvents[i].returnValues.employee === props.accounts[0]) {
        events.approveContractRequest.push({
          employee: propsEvents[i].returnValues.employee,
          landlord: propsEvents[i].returnValues.landlord,
          fileHash: propsEvents[i].returnValues.fileHash
        });
      } else if (propsEvents[i].event === 'approveContractResponse' && propsEvents[i].returnValues.landlord === props.accounts[0]) {
        events.approveContractResponse.push({
          employee: propsEvents[i].returnValues.employee,
          landlord: propsEvents[i].returnValues.landlord,
          fileHash: propsEvents[i].returnValues.fileHash
        });
      } else if (propsEvents[i].event === 'updateHA' && propsEvents[i].returnValues.housingAuthority === props.accounts[0]) {
        events.updateHA.push({
          employee: propsEvents[i].returnValues.employee,
          employeeName: propsEvents[i].returnValues.employeeName,
          landlord: propsEvents[i].returnValues.landlord,
          landlordName: propsEvents[i].returnValues.landlordName,
          fileHash: propsEvents[i].returnValues.fileHash,
          moveInDate: propsEvents[i].returnValues.moveInDate
        });
      } else if (propsEvents[i].event === 'verificationRequest' && propsEvents[i].returnValues.thirdParty === props.accounts[0]) {
        var employee = decrypt(keyMappings[this.props.accounts[0].toLowerCase()].substr(2), propsEvents[i].returnValues[0]);
        var req = decrypt(keyMappings[this.props.accounts[0].toLowerCase()].substr(2), propsEvents[i].returnValues[1]);
        events.verificationRequest.push({
          employee: employee,
          req: req,
          persona: propsEvents[i].returnValues.persona,
          landlord: propsEvents[i].returnValues.landlord
        });
      } else if (propsEvents[i].event === 'verificationResponse' && propsEvents[i].returnValues.landlord === props.accounts[0]) {
        var emp = decrypt(keyMappings[this.props.accounts[0].toLowerCase()].substr(2), propsEvents[i].returnValues[0]);
        var resp = decrypt(keyMappings[this.props.accounts[0].toLowerCase()].substr(2), propsEvents[i].returnValues[1]);
        var respObj = JSON.parse(resp);
        console.log(respObj);
        events.verificationResponse.push({
          employee: emp,
          response: respObj.response,
          requirement: respObj.requirement,
          persona: respObj.persona
        });
      }
    }
    this.state = {
      MyEmployer: '',
      events: events,
      haLandlordName: '',
      haEmployeeName: '',
      haMoveInData: '',
      haId: ''
    };
    console.log(this.state);
  }

  employerChange(event) {
    this.setState({ MyEmployer: event.target.value });
  }

  haDataLandlordChange(event) {
    this.setState({ haLandlordName: event.target.value });
  }

  haDataEmployeeChange(event) {
    this.setState({ haEmployeeName: event.target.value });
  }

  haDataDateChange(event) {
    this.setState({ haMoveInData: event.target.value });
  }

  haChange(event) {
    this.setState({ haId: event.target.value });
  }

  handleApprove = (landlord) => (e) => {
    var account = '';
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Couldn't get accounts");
      account = result[0];
    });

    let self = this;

    getContract(this.context.drizzle)
      .then(function(instance) {
        var pubKey = util.privateToPublic(keyMappings[landlord.toLowerCase()]);

        var data = {
          Employer: self.state.MyEmployer,
          Bank: self.state.MyBank,
          HousingAuthority: self.state.MyHousingAuthority,
          InsuranceProvider: self.state.MyInsuranceProvider,
          Police: self.state.MyPolice
        };

        var encryptedPartners = encrypt(pubKey, JSON.stringify(data));

        return instance.legitimzeDataRequest(landlord, encryptedPartners, { from: account });
      })
      .then(function(result) {
        alert('Request approved successfully! Transaction Hash: ' + result.tx);
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  };

  clearPdf = () => (e) => {
    var canvas = document.getElementById('the-canvas');
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.height = 2;
    canvas.width = 0;
  };

  contractRender = (fileHash) => (e) => {
    console.log(fileHash);
    const self = this;
    this.ipfsApi.cat(fileHash, function(err, file) {
      if (err) {
        throw err;
      }
      console.log(file.toString('base64'));
      self.setState({ file_content: file.toString('base64') });
      self.renderPdf();
    });
  };

  handleContractApprove = (landlord, fileHash) => (e) => {
    var account = '';
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Couldn't get accounts");
      account = result[0];
    });

    getContract(this.context.drizzle)
      .then(function(instance) {
        return instance.approveContract(landlord, fileHash, { from: account });
      })
      .then(function(result) {
        alert('Contract Request approved successfully! Transaction Hash: ' + result.tx);
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  };

  renderPdf() {
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

  sendUpdateHAEvent = (employeeId, fileHash) => (e) => {
    var account = '';
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Couldn't get accounts");
      account = result[0];
    });

    var landlordName = this.state.haLandlordName;
    console.log(landlordName);
    var employeeName = this.state.haEmployeeName;
    var haID = this.state.haId;

    getContract(this.context.drizzle)
      .then(function(instance) {
        return instance.updateHousingAuthority(landlordName, employeeId, employeeName, haID, fileHash, { from: account });
      })
      .then(function(result) {
        alert('Contract Request approved successfully! Transaction Hash: ' + result.tx);
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  };

  updateAddressRegistration = (employeeId, employeeName, landlordId, landlordName, fileHash) => (e) => {
    const contractData = {
      landlordId: landlordId,
      landlordName: landlordName,
      tenantID: employeeId,
      tenantName: employeeName,
      contractID: fileHash
    };

    //first user transaction - CREATE
    const txCreateContract = driver.Transaction.makeCreateTransaction(
      contractData,
      null,
      [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(this.ha.publicKey))],
      this.ha.publicKey
    );

    //first user transaction - SIGN
    const txSigned = driver.Transaction.signTransaction(txCreateContract, this.ha.privateKey);

    //first user transaction - SEND
    this.conn.postTransactionCommit(txSigned).then((res) => {
      console.log(res);
    });

    //search asset
    this.conn.searchAssets(employeeId).then((assets) => console.log(assets));
  };

  handleQuery = (event) => (e) => {
    var account = '';
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Couldn't get accounts");
      account = result[0];
    });
    let self = this;
    getContract(this.context.drizzle).then(function(instance) {
      var pubKey = util.privateToPublic(keyMappings[event.employer.toLowerCase()]);
      console.log(pubKey);
      var emp = encrypt(pubKey, event.employee);
      var req = encrypt(pubKey, self.state.minSalary);
      instance.RequestRequirementVerification(emp, req, 'employer', event.employer, account, { from: account });

      pubKey = util.privateToPublic(keyMappings[event.bank.toLowerCase()]);
      req = encrypt(pubKey, self.state.minDeposit);
      emp = encrypt(pubKey, event.employee);
      instance.RequestRequirementVerification(emp, req, 'bank', event.bank, account, { from: account });

      pubKey = util.privateToPublic(keyMappings[event.housingAuthority.toLowerCase()]);
      req = encrypt(pubKey, self.state.changeFrequency);
      emp = encrypt(pubKey, event.employee);
      instance.RequestRequirementVerification(emp, req, 'housingAuthority', event.housingAuthority, account, { from: account });

      pubKey = util.privateToPublic(keyMappings[event.insuranceProvider.toLowerCase()]);
      req = encrypt(pubKey, self.state.minInsurance);
      emp = encrypt(pubKey, event.employee);
      instance.RequestRequirementVerification(emp, req, 'insuranceProvider', event.insuranceProvider, account, { from: account });

      pubKey = util.privateToPublic(keyMappings[event.police.toLowerCase()]);
      req = encrypt(pubKey, self.state.maxPolice);
      emp = encrypt(pubKey, event.employee);
      instance.RequestRequirementVerification(emp, req, 'police', event.police, account, { from: account });
    });
  };

  handleVerify = (event, verify) => (e) => {
    var account = '';
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Couldn't get accounts");
      account = result[0];
    });
    getContract(this.context.drizzle)
      .then(function(instance) {
        var pubKey = util.privateToPublic(keyMappings[event.landlord.toLowerCase()]);
        console.log(pubKey);
        var emp = encrypt(pubKey, event.employee);
        var resObj = {
          response: verify,
          requirement: event.req,
          persona: event.persona
        };
        var res = encrypt(pubKey, JSON.stringify(resObj));
        return instance.VerifyRequirement(emp, res, event.landlord, { from: account });
      })
      .then(function(result) {
        alert('Request verified/refuted successfully! Transaction Hash: ' + result.tx);
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  };

  render() {
    let self = this;
    let role = this.props.role;
    return (
      <div>
        {role === 'Landlord' && (
          <div>
            <h5>Data Access legitimized Events </h5>
            <br />
            <br />
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Associated 3rd Parties</th>
                  <th>My Requirements</th>
                </tr>
              </thead>
              {self.state.events.employeeLegitimises.map(function(event, i) {
                return (
                  <tbody key={i}>
                    <tr>
                      <td>
                        <Blockies seed={event.employee} size={10} scale={10} />
                        {event.employee}
                      </td>
                      <td>
                        <table>
                          <tbody>
                            <tr>
                              <td>Employer</td>
                              <td>
                                <Blockies seed={event.employer} size={5} scale={5} />
                              </td>
                            </tr>
                            <tr>
                              <td>Bank</td>
                              <td>
                                <Blockies seed={event.bank} size={5} scale={5} />{' '}
                              </td>
                            </tr>
                            <tr>
                              <td>Housing Authority</td>
                              <td>
                                <Blockies seed={event.housingAuthority} size={5} scale={5} />{' '}
                              </td>
                            </tr>
                            <tr>
                              <td>Insurance Provider</td>
                              <td>
                                <Blockies seed={event.insuranceProvider} size={5} scale={5} />{' '}
                              </td>
                            </tr>
                            <tr>
                              <td>Police</td>
                              <td>
                                <Blockies seed={event.police} size={5} scale={5} />{' '}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td>
                        <table>
                          <tbody>
                            <tr>
                              <td>
                                <input
                                  type="text"
                                  value={self.state.minSalary}
                                  placeholder={'Monthly minimum Salary'}
                                  onChange={(e) => self.setState({ minSalary: e.target.value })}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input
                                  type="text"
                                  value={self.state.minDeposit}
                                  placeholder={'Minimum bank deposit'}
                                  onChange={(e) => self.setState({ minDeposit: e.target.value })}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input
                                  type="text"
                                  value={self.state.changeFrequency}
                                  placeholder={'Yearly change frequency'}
                                  onChange={(e) => self.setState({ changeFrequency: e.target.value })}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input
                                  type="text"
                                  value={self.state.minInsurance}
                                  placeholder={'Minimum liability insurance'}
                                  onChange={(e) => self.setState({ minInsurance: e.target.value })}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input
                                  type="text"
                                  value={self.state.maxPolice}
                                  placeholder={'Maximum police cases'}
                                  onChange={(e) => self.setState({ maxPolice: e.target.value })}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td>
                        <button onClick={self.handleQuery(event)}>Send Query</button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
            <br />
            <br />
          </div>
        )}
        {role === 'Employee' && (
          <div>
            <input
              type="text"
              value={this.state.MyEmployer}
              placeholder={'My Employer'}
              onChange={(e) => self.setState({ MyEmployer: e.target.value })}
            />
            <br />
            <input type="text" value={this.state.MyBank} placeholder={'My Bank'} onChange={(e) => self.setState({ MyBank: e.target.value })} />
            <br />
            <input
              type="text"
              value={this.state.MyHousingAuthority}
              placeholder={'My Housing Authority'}
              onChange={(e) => self.setState({ MyHousingAuthority: e.target.value })}
            />
            <br />
            <input
              type="text"
              value={this.state.MyInsuranceProvider}
              placeholder={'My Insurance Provider'}
              onChange={(e) => self.setState({ MyInsuranceProvider: e.target.value })}
            />
            <br />
            <input type="text" value={this.state.MyPolice} placeholder={'My Police'} onChange={(e) => self.setState({ MyPolice: e.target.value })} />
            <br />
            <table>
              <thead>
                <tr>
                  <th>Landlord Address</th>
                  <th>Identicon</th>
                  <th>Action</th>
                </tr>
              </thead>
              {self.state.events.dataRequestInitiated.map(function(event, i) {
                return (
                  <tbody key={i}>
                    <tr>
                      <td>{event.landlord}</td>
                      <td>
                        <Blockies seed={event.landlord} size={10} scale={10} />
                      </td>
                      <td>
                        <button onClick={self.handleApprove(event.landlord)}>Approve</button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
            <br />
            <br />
          </div>
        )}
        {role === 'Employee' && (
          <div>
            <h5>Contract Approval Request Events </h5>
            <table>
              <thead>
                <tr>
                  <th>Landlord Address</th>
                  <th>Identicon</th>
                  <th>Action</th>
                  <th>Render</th>
                  <th>Clear PDF </th>
                </tr>
              </thead>
              {self.state.events.approveContractRequest.map(function(event, i) {
                return (
                  <tbody key={i}>
                    <tr>
                      <td>{event.landlord}</td>
                      <td>
                        <Blockies seed={event.landlord} size={10} scale={10} />
                      </td>
                      <td>
                        <button onClick={self.handleContractApprove(event.landlord, event.fileHash)}>Approve</button>
                      </td>
                      <td>
                        <button onClick={self.contractRender(event.fileHash)}>Render</button>
                      </td>
                      <td>
                        <button onClick={self.clearPdf()}>Clear PDF</button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
            <br />
            <canvas width="2" height="2" id="the-canvas" />
            <br />
            <br />
          </div>
        )}
        {role === 'Landlord' && (
          <div>
            <h5>Contract Approval Response Events </h5>
            <input type="text" value={this.state.haEmployeeName} placeholder={'Tenant'} onChange={this.haDataEmployeeChange} />
            <input type="text" value={this.state.haLandlordName} placeholder={'Landlord'} onChange={this.haDataLandlordChange} />
            <input type="text" value={this.state.haMoveInData} placeholder={'Move In Date'} onChange={this.haDataDateChange} />
            <input type="text" value={this.state.haId} placeholder={'HA Address'} onChange={this.haChange} />
            <table>
              <thead>
                <tr>
                  <th>Employee Address</th>
                  <th>Identicon</th>
                  <th>Action</th>
                </tr>
              </thead>
              {self.state.events.approveContractResponse.map(function(event, i) {
                return (
                  <tbody key={i}>
                    <tr>
                      <td>{event.employee}</td>
                      <td>
                        <Blockies seed={event.landlord} size={10} scale={10} />
                      </td>
                      <td width="20px">
                        <button onClick={self.contractRender(event.fileHash)}>Render</button>
                        <br />
                        <br />
                        <button onClick={self.clearPdf()}>Clear PDF</button>
                        <br />
                        <button onClick={self.sendUpdateHAEvent(event.employee, event.fileHash)}>Update HA</button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
            <br />
            <br />
            <canvas width="2" height="2" id="the-canvas" />
            <br />
            <br />
          </div>
        )}
        {role === 'HousingAuthority' && (
          <div>
            <h5>Housing Authority Events</h5>
            <table>
              <thead>
                <tr>
                  <th>Tenant ID</th>
                  <th>Tenant Name</th>
                  <th>Landlord ID</th>
                  <th>Landlord Name</th>
                  <th>Contract File Id</th>
                </tr>
              </thead>
              {self.state.events.updateHA.map(function(event, i) {
                return (
                  <tbody key={i}>
                    <tr>
                      <td>
                        <Blockies seed={event.employee} size={10} scale={10} />
                      </td>
                      <td>{event.employeeName}</td>
                      <td>
                        <Blockies seed={event.landlord} size={10} scale={10} />
                      </td>
                      <td>{event.landlordName}</td>
                      <td>{event.fileHash}</td>
                      <td width="20px">
                        <button
                          onClick={self.updateAddressRegistration(
                            event.employee,
                            event.employeeName,
                            event.landlord,
                            event.landlordName,
                            event.fileHash
                          )}
                        >
                          Update HA
                        </button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        )}
        {role === 'Employer' && (
          <div>
            <h5>Minimum Salary Verification Requests</h5>
            <table>
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Requirement</th>
                </tr>
              </thead>
              {self.state.events.verificationRequest.map(function(event, i) {
                if (event.persona === 'employer') {
                  return (
                    <tbody key={i}>
                      <tr>
                        <td>
                          <Blockies seed={event.employee} size={10} scale={10} />
                          {event.employee}
                        </td>
                        <td>{event.req}</td>
                        <td>
                          <button onClick={self.handleVerify(event, true)}>Verify</button>
                        </td>
                        <td>
                          <button onClick={self.handleVerify(event, false)}>Refute</button>
                        </td>
                      </tr>
                    </tbody>
                  );
                }
                return null;
              })}
            </table>
          </div>
        )}
        {role === 'Bank' && (
          <div>
            <h5>Minimum Deposit Verification Requests</h5>
            <table>
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Requirement</th>
                </tr>
              </thead>
              {self.state.events.verificationRequest.map(function(event, i) {
                if (event.persona === 'bank') {
                  return (
                    <tbody key={i}>
                      <tr>
                        <td>
                          <Blockies seed={event.employee} size={10} scale={10} />
                          {event.employee}
                        </td>
                        <td>{event.req}</td>
                        <td>
                          <button onClick={self.handleVerify(event, true)}>Verify</button>
                        </td>
                        <td>
                          <button onClick={self.handleVerify(event, false)}>Refute</button>
                        </td>
                      </tr>
                    </tbody>
                  );
                }
                return null;
              })}
            </table>
          </div>
        )}
        {role === 'HousingAuthority' && (
          <div>
            <h5>Maximum Change Frequency Verification Requests</h5>
            <table>
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Requirement</th>
                </tr>
              </thead>
              {self.state.events.verificationRequest.map(function(event, i) {
                if (event.persona === 'housingAuthority') {
                  return (
                    <tbody key={i}>
                      <tr>
                        <td>
                          <Blockies seed={event.employee} size={10} scale={10} />
                          {event.employee}
                        </td>
                        <td>{event.req}</td>
                        <td>
                          <button onClick={self.handleVerify(event, true)}>Verify</button>
                        </td>
                        <td>
                          <button onClick={self.handleVerify(event, false)}>Refute</button>
                        </td>
                      </tr>
                    </tbody>
                  );
                }
                return null;
              })}
            </table>
          </div>
        )}
        {role === 'InsuranceProvider' && (
          <div>
            <h5>Minimum Liability Insurance Verification Requests</h5>
            <table>
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Requirement</th>
                </tr>
              </thead>
              {self.state.events.verificationRequest.map(function(event, i) {
                if (event.persona === 'insuranceProvider') {
                  return (
                    <tbody key={i}>
                      <tr>
                        <td>
                          <Blockies seed={event.employee} size={10} scale={10} />
                          {event.employee}
                        </td>
                        <td>{event.req}</td>
                        <td>
                          <button onClick={self.handleVerify(event, true)}>Verify</button>
                        </td>
                        <td>
                          <button onClick={self.handleVerify(event, false)}>Refute</button>
                        </td>
                      </tr>
                    </tbody>
                  );
                }
                return null;
              })}
            </table>
          </div>
        )}
        {role === 'Police' && (
          <div>
            <h5>Maximum Cases Verification Requests</h5>
            <table>
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Requirement</th>
                </tr>
              </thead>
              {self.state.events.verificationRequest.map(function(event, i) {
                if (event.persona === 'police') {
                  return (
                    <tbody key={i}>
                      <tr>
                        <td>
                          <Blockies seed={event.employee} size={10} scale={10} />
                          {event.employee}
                        </td>
                        <td>{event.req}</td>
                        <td>
                          <button onClick={self.handleVerify(event, true)}>Verify</button>
                        </td>
                        <td>
                          <button onClick={self.handleVerify(event, false)}>Refute</button>
                        </td>
                      </tr>
                    </tbody>
                  );
                }
                return null;
              })}
            </table>
          </div>
        )}
        {role === 'Landlord' && (
          <div>
            <h5>Verification Responses</h5>
            <table>
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>3rd Party</th>
                  <th>Requirement</th>
                  <th>Response</th>
                </tr>
              </thead>
              {self.state.events.verificationResponse.map(function(event, i) {
                return (
                  <tbody key={i}>
                    <tr>
                      <td>
                        <Blockies seed={event.employee} size={10} scale={10} />
                        {event.employee}
                      </td>
                      <td>{event.persona}</td>
                      {event.persona === 'employer' && <td>Minimum Salary: {event.requirement}</td>}
                      {event.persona === 'bank' && <td>Minimum Deposit: {event.requirement}</td>}
                      {event.persona === 'housingAuthority' && <td>Maximum Change Frequency: {event.requirement}</td>}
                      {event.persona === 'insuranceProvider' && <td>Minimum Insurance: {event.requirement}</td>}
                      {event.persona === 'police' && <td>Maximum Police Cases: {event.requirement}</td>}
                      <td>{event.response ? '✔' : '✘'}</td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        )}
      </div>
    );
  }
}

Events.contextTypes = {
  drizzle: PropTypes.object
};

export default Events;
