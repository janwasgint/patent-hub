import React, { Component } from "react";
import { AccountData } from "drizzle-react-components";
import PropTypes from "prop-types";
import Blockies from "react-blockies";

// Inventor components
import ShareProposalContainer from "../Inventor/ShareProposalContainer";

//Patent Agent
import PatentAgentUIContainer from "../PatentAgent/PatentAgentUIContainer";

//import VerifyDataContainer from '../VerifyData/VerifyDataContainer';
//import EventsContainer from '../Events/EventsContainer';
import HostSelect from "../HostSelect/HostSelect";
//import UploadContractContainer from '../UploadContract/UploadContractContainer';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var hostDataKey = this.context.drizzle.contracts["PatentHub"].methods[
      "host"
    ].cacheCall();
    this.setState({ hostDataKey: hostDataKey });
    var inventorDataKey = this.context.drizzle.contracts["PatentHub"].methods[
      "isRegisteredAsInventor"
    ].cacheCall(this.props.accounts[0]);
    this.setState({ inventorDataKey: inventorDataKey });
    var patentAgentDataKey = this.context.drizzle.contracts[
      "PatentHub"
    ].methods["isRegisteredAsPatentAgent"].cacheCall(this.props.accounts[0]);
    this.setState({ patentAgentDataKey: patentAgentDataKey });
    var drawerDataKey = this.context.drizzle.contracts["PatentHub"].methods[
      "isRegisteredAsDrawer"
    ].cacheCall(this.props.accounts[0]);
    this.setState({ drawerDataKey: drawerDataKey });
    var nationalizerDataKey = this.context.drizzle.contracts[
      "PatentHub"
    ].methods["isRegisteredAsNationalizer"].cacheCall(this.props.accounts[0]);
    this.setState({ nationalizerDataKey: nationalizerDataKey });
    var translatorDataKey = this.context.drizzle.contracts["PatentHub"].methods[
      "isRegisteredAsTranslator"
    ].cacheCall(this.props.accounts[0]);
    this.setState({ translatorDataKey: translatorDataKey });
    var patentOfficeDataKey = this.context.drizzle.contracts[
      "PatentHub"
    ].methods["isRegisteredAsPatentOffice"].cacheCall(this.props.accounts[0]);
    this.setState({ patentOfficeDataKey: patentOfficeDataKey });
  }

  componentWillReceiveProps() {
    if (this.state.role !== undefined) {
      return;
    }

    if (
      !this.props.PatentHub.initialized ||
      !(this.state.hostDataKey in this.props.PatentHub.host) ||
      !(
        this.state.inventorDataKey in
        this.props.PatentHub.isRegisteredAsInventor
      ) ||
      !(
        this.state.patentAgentDataKey in
        this.props.PatentHub.isRegisteredAsPatentAgent
      ) ||
      !(
        this.state.drawerDataKey in this.props.PatentHub.isRegisteredAsDrawer
      ) ||
      !(
        this.state.nationalizerDataKey in
        this.props.PatentHub.isRegisteredAsNationalizer
      ) ||
      !(
        this.state.translatorDataKey in
        this.props.PatentHub.isRegisteredAsTranslator
      ) ||
      !(
        this.state.patentOfficeDataKey in
        this.props.PatentHub.isRegisteredAsPatentOffice
      )
    ) {


      // local copy of the events we are interested in
      this.events = {
        participantRegistered: [],
      };

      // fetch all events we have to listen to from the contract
      let propsEvents = this.props.PatentHub.events;
      //console.log(propsEvents);
      // iterate all events to get the one we are interested in - participantRegistered(address indexed participant, string role)
      // for events parameters see PatentHub.sol
      for (var i = 0; i < propsEvents.length; i++) {
        if (propsEvents[i].event === 'participantRegistered') {// && propsEvents[i].returnValues.landlord === props.accounts[0]) {
          this.events.participantRegistered.push({
            participant: propsEvents[i].returnValues.participant,
            role: propsEvents[i].returnValues.role,
          });
        }
      }
      console.log(this.events.participantRegistered);
      return;
    }

    var host = this.props.PatentHub.host[this.state.hostDataKey].value;
    var inventor = this.props.PatentHub.isRegisteredAsInventor[
      this.state.inventorDataKey
    ].value;
    var patentAgent = this.props.PatentHub.isRegisteredAsPatentAgent[
      this.state.patentAgentDataKey
    ].value;
    var drawer = this.props.PatentHub.isRegisteredAsDrawer[
      this.state.drawerDataKey
    ].value;
    var nationalizer = this.props.PatentHub.isRegisteredAsNationalizer[
      this.state.nationalizerDataKey
    ].value;
    var translator = this.props.PatentHub.isRegisteredAsTranslator[
      this.state.translatorDataKey
    ].value;
    var patentOffice = this.props.PatentHub.isRegisteredAsPatentOffice[
      this.state.patentOfficeDataKey
    ].value;

    var myAddr = this.props.accounts[0];

    var role = "Unregistered";
    if (host === myAddr) {
      role = "Host";
    } else if (inventor) {
      role = "Inventor";
    } else if (patentAgent) {
      role = "PatentAgent";
    } else if (drawer) {
      role = "Drawer";
    } else if (nationalizer) {
      role = "Nationalizer";
    } else if (translator) {
      role = "Translator";
    } else if (patentOffice) {
      role = "PatentOffice";
    }

    this.setState({ role: role });
  }

  render() {
    if (this.state.role === undefined) {
      return <span>Loading...</span>;
    }

    var myAddr = this.props.accounts[0];
    let role = this.state.role;
    let self = this;

    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <div className="jumbotron">
              <h1 className="display-4">Patent Hub</h1>

              <hr className="my-4" />
              <p className="lead">
                <Blockies seed={myAddr} size={10} scale={10} />
              </p>
              <p>
                <AccountData accountIndex="0" units="ether" precision="3" />
              </p>
            </div>
          </div>

          <div className="pure-u-1-1">
            <h2 className="card-header">Contract actions</h2>
            {this.state.role === "Host" && (
              <div>
                <div>
                  <p>
                    <strong>Register Actor</strong>:
                  </p>
                  <HostSelect />
                </div>

                <p />   

                <div className="card">
                    <h5 className="card-header">Registered Participants</h5>
                    <table>
                      <thead>
                        <tr>
                          <th>Address</th>
                          <th>Role</th>
                        </tr>
                      </thead>
                      {this.events.participantRegistered.map(function(event, i) {
                          return (
                            <tbody key={i}>
                              <tr>
                                <td>
                                  <Blockies seed={event.participant} size={10} scale={10} />
                                  {event.participant}
                                </td>
                                <td>{event.role}</td>
                              </tr>
                            </tbody>
                          );
                        })}
                     </table>
                </div>
              </div>
            )}
            {this.state.role === "Unregistered" && (
              <div>
                <p>
                  <strong>I am not registered!</strong>
                </p>
              </div>
            )}
            {this.state.role === "Inventor" && (
              <div>
                <ShareProposalContainer />
              </div>
            )}
            {this.state.role === "PatentAgent" && (
              <div>
                <PatentAgentUIContainer />
              </div>
            )}
            {/*{role === 'Landlord' && (
              <div>
               <p>
                  <strong>Verify Data as a Landlord</strong>:
                </p>
                <VerifyDataContainer />
              </div>
            )}
            {role === 'Landlord' && (
              <div>
                <p>
                  <strong>Upload Contract</strong>:
                </p>
                <UploadContractContainer />
              </div>
            )}*/}

            <br />
            <br />
          </div>
       
          {/*<div className="pure-u-1-1">
            {role === "Host" && <h2>Events</h2>}
            {role === 'Employer' && <h2>Events</h2>}
            {role === 'Employee' && <h2>Data Requests</h2>}
            {role === 'Landlord' && <h2>Data Approvals</h2>}
            <EventsContainer role={role} />
            <br />
            <br />
          </div>*/}
        </div>
      </main>
    );
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object
};

export default Home;
