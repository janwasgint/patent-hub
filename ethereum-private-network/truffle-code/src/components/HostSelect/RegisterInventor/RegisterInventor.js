import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getContract } from '../../../utils/MyContracts.js';

class RegisterInventor extends Component {
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
      if (error != null) console.log("Could not get accounts!");
      account = result[0];
    });

    var inventorAddr = this.state.value;

    getContract(this.context.drizzle)
      .then(function(instance) {
        return instance.registerInventor(inventorAddr, { from: account });
      })
      .then(function(result) {
        alert('Inventor registered successfully! Transaction Hash: ' + result.tx);
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
        <button onClick={this.onClick}>Register</button>
      </div>
    );
  }
}

RegisterInventor.contextTypes = {
  drizzle: PropTypes.object
};

export default RegisterInventor;
