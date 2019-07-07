import React, { Component } from 'react';

import RegisterInventorContainer from './RegisterInventor/RegisterInventorContainer';
import RegisterPatentAgentContainer from './RegisterPatentAgent/RegisterPatentAgentContainer';
import RegisterDrawerContainer from './RegisterDrawer/RegisterDrawerContainer';
import RegisterNationalizerContainer from './RegisterNationalizer/RegisterNationalizerContainer';
//import RegisterTranslatorContainer from './RegisterTranslator/RegisterTranslatorContainer';
import RegisterPatentOfficeContainer from './RegisterPatentOffice/RegisterPatentOfficeContainer';

class HostSelect extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 'inventor' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    let selectContainer;

    switch (this.state.value) {
      case 'inventor':
        selectContainer = (
          <div>
            <p>Register Inventor: </p>
            <RegisterInventorContainer />
          </div>
        );
        break;

      case 'patent_agent':
        selectContainer = (
          <div>
            <p>Register Patent Agent</p>
            <RegisterPatentAgentContainer />
          </div>
        );
        break;
      case 'drawer':
        selectContainer = (
          <div>
            <p>Register Drawer</p>
            <RegisterDrawerContainer />
          </div>
        );
        break;
      case 'nationalizer':
        selectContainer = (
          <div>
            <p>Register Nationalizer</p>
            <RegisterNationalizerContainer />
          </div>
        );
        break;
      {/*case 'translator':
        selectContainer = (
          <div>
            <p>Register Translator</p>
            <RegisterTranslatorContainer />
          </div>
        );
        break;*/}
      case 'patent_office':
        selectContainer = (
          <div>
            <p>Register Patent Office</p>
            <RegisterPatentOfficeContainer />
          </div>
        );
        break;
      default:
        selectContainer = null;
    }
    return (
      <div>
        <select value={this.state.value} onChange={this.handleChange}>
          <option value="inventor">Inventor</option>
          <option value="patent_agent">Patent Agent</option>
          <option value="drawer">Drawer</option>
          <option value="nationalizer">Nationalizer</option>
          {/*<option value="translator">Translator</option>*/}
          <option value="patent_office">Patent Office</option>
        </select>
        {selectContainer}
      </div>
    );
  }
}

export default HostSelect;
