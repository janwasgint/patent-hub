import React, { Component } from "react";
import { AccountData } from "drizzle-react-components";
import PropTypes from "prop-types";
import Blockies from "react-blockies";

import { actorsAndRoles } from "../shared";

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
    this.state = { account: 0 };
  }

  render() {
    var myAddr = this.props.accounts[0];
    var role = actorsAndRoles[myAddr.toLowerCase()];

    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <div className="jumbotron">
              <h1 className="display-4">{role}</h1>
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
            {typeof role == "undefined" && (
              <span>
                Loading...
              </span>
            )}
            {role === "Host" && (
              <div>
                <HostContainer />
              </div>
            )}
            {role === "Inventor" && (
              <div>
                <InventorContainer />
              </div>
            )}
            {role === "Patent Agent" && (
              <div>
                <PatentAgentContainer />
              </div>
            )}
            {role === "Drawer" && (
              <div>
                <DrawerContainer />
              </div>
            )}
            {/*{role === "Translator" && (
              <div>
                <TranslatorContainer />
              </div>
            )}*/}
            {role === "Nationalizer" && (
              <div>
                <NationalizerContainer />
              </div>
            )}
            {role === "Patent Office" && (
              <div>
                <PatentOfficeContainer />
              </div>
            )}
            {role === "Unregistered" && (
              <div>
                <p>
                  <strong>I am not registered!</strong>
                </p>
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
