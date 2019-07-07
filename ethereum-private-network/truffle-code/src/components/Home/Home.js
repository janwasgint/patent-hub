import React, { Component } from "react";
import { AccountData } from "drizzle-react-components";
import PropTypes from "prop-types";
import Blockies from "react-blockies";

import HostContainer from "../Host/HostContainer";
import InventorContainer from "../Inventor/InventorContainer";
import PatentAgentContainer from "../PatentAgent/PatentAgentContainer";
import DrawerContainer from "../Drawer/DrawerContainer";
import NationalizerContainer from "../Nationalizer/NationalizerContainer";
import PatentOfficeContainer from "../PatentOffice/PatentOfficeContainer";
//import TranslatorContainer from "../Translator/TranslatorContainer";

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
    /*var translatorDataKey = this.context.drizzle.contracts["PatentHub"].methods[
      "isRegisteredAsTranslator"
    ].cacheCall(this.props.accounts[0]);
    this.setState({ translatorDataKey: translatorDataKey });*/
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
      /*!(
        this.state.translatorDataKey in
        this.props.PatentHub.isRegisteredAsTranslator
      ) ||*/
      !(
        this.state.patentOfficeDataKey in
        this.props.PatentHub.isRegisteredAsPatentOffice
      )
    ) {
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
    /*var translator = this.props.PatentHub.isRegisteredAsTranslator[
      this.state.translatorDataKey
    ].value;*/
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
      role = "Patent Agent";
    } else if (drawer) {
      role = "Drawer";
    } else if (nationalizer) {
      role = "Nationalizer";
    } /*else if (translator) {
      role = "Translator";
    }*/ else if (patentOffice) {
      role = "Patent Office";
    }
    this.setState({ role: role });
  }

  


  render() {
    if (this.state.role === undefined) {
      return <span>Loading...</span>;
    }

    var myAddr = this.props.accounts[0];

    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <div className="jumbotron">
              <h1 className="display-4">{this.state.role}</h1>

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
            {this.state.role === "Unregistered" && (
              <div>
                <p>
                  <strong>I am not registered!</strong>
                </p>
              </div>
            )}
            {this.state.role === "Host" && (
              <div>
                <HostContainer />
              </div>
            )}
            {this.state.role === "Inventor" && (
              <div>
                <InventorContainer />
              </div>
            )}
            {this.state.role === "Patent Agent" && (
              <div>
                <PatentAgentContainer />
              </div>
            )}
            {this.state.role === "Drawer" && (
              <div>
                <DrawerContainer />
              </div>
            )}
            {/*{this.state.role === "Translator" && (
              <div>
                <TranslatorContainer />
              </div>
            )}*/}
            {this.state.role === "Nationalizer" && (
              <div>
                <NationalizerContainer />
              </div>
            )}
            {this.state.role === "Patent Office" && (
              <div>
                <PatentOfficeContainer />
              </div>
            )}
            <br />
            <br />
          </div>
        </div>
      </main>
    );
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object
};

export default Home;
