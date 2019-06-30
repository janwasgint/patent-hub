import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getContract } from './../../util/MyContracts.js';

class AddInsuranceProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  onClick = (e) => {
    var account = '';
    this.context.drizzle.web3.eth.getAccounts(function(error, result) {
      if (error != null) console.log("Couldn't get accounts");
      account = result[0];
    });

    var insuranceProviderAddr = this.state.value;

    getContract(this.context.drizzle)
      .then(function(instance) {
        return instance.addInsuranceProvider(insuranceProviderAddr, { from: account });
      })
      .then(function(result) {
        alert('InsuranceProvider added successfully! Transaction Hash: ' + result.tx);
        console.log(result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  };
  render() {
    return (
      <div>
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <button onClick={this.onClick}>Add</button>
      </div>
    );
  }
}

AddInsuranceProvider.contextTypes = {
  drizzle: PropTypes.object
};

export default AddInsuranceProvider;
