import React, { Component } from 'react';
import AddEmployerContainer from '../../components/AddEmployer/AddEmployerContainer';
import AddBankContainer from '../AddBank/AddBankContainer';
import AddHousingAuthority from '../AddHousingAuthority/AddHousingAuthority';
import AddInsuranceProvider from '../AddInsuranceProvider/AddInsuranceProvider';
import AddPoliceContainer from '../AddPolice/AddPoliceContainer';

class FederationSelect extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 'employer' };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    let selectContainer;

    switch (this.state.value) {
      case 'employer':
        selectContainer = (
          <div>
            <p>Add Employer: </p>
            <AddEmployerContainer />
          </div>
        );
        break;

      case 'bank':
        selectContainer = (
          <div>
            <p> Add Bank</p>
            <AddBankContainer />
          </div>
        );
        break;
      case 'police':
        selectContainer = (
          <div>
            <p> Add Police</p>
            <AddPoliceContainer />
          </div>
        );
        break;
      case 'housing_authority':
        selectContainer = (
          <div>
            <p> Add Housing Authority</p>
            <AddHousingAuthority />
          </div>
        );
        break;
      case 'insurance_provider':
        selectContainer = (
          <div>
            <p> Add Insurance Provider</p>
            <AddInsuranceProvider />
          </div>
        );
        break;
      default:
        selectContainer = null;
    }
    return (
      <div>
        <select value={this.state.value} onChange={this.handleChange}>
          <option value="employer">Employer</option>
          <option value="bank">Bank</option>
          <option value="housing_authority">Housing Authority</option>
          <option value="insurance_provider">Insurance Provider</option>
          <option value="police">Police</option>
        </select>

        {selectContainer}
      </div>
    );
  }
}

export default FederationSelect;
