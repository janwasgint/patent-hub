import React, { Component } from 'react';
import { AccountData } from 'drizzle-react-components';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';

import VerifyDataContainer from '../VerifyData/VerifyDataContainer';
import EventsContainer from '../Events/EventsContainer';
import FederationSelect from '../FederationSelect/FederationSelect';
import UploadContractContainer from '../UploadContract/UploadContractContainer';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var federationDataKey = this.context.drizzle.contracts['ProofOfEmployment'].methods['federation'].cacheCall();
    this.setState({ federationDataKey: federationDataKey });
    var employerDataKey = this.context.drizzle.contracts['ProofOfEmployment'].methods['checkEmployer'].cacheCall(this.props.accounts[0]);
    this.setState({ employerDataKey: employerDataKey });
    var bankDataKey = this.context.drizzle.contracts['ProofOfEmployment'].methods['checkBank'].cacheCall(this.props.accounts[0]);
    this.setState({ bankDataKey: bankDataKey });
    var housingAuthorityDataKey = this.context.drizzle.contracts['ProofOfEmployment'].methods['checkHousingAuthority'].cacheCall(
      this.props.accounts[0]
    );
    this.setState({ housingAuthorityDataKey: housingAuthorityDataKey });
    var insuranceProviderDataKey = this.context.drizzle.contracts['ProofOfEmployment'].methods['checkInsuranceProvider'].cacheCall(
      this.props.accounts[0]
    );
    this.setState({ insuranceProviderDataKey: insuranceProviderDataKey });
    var policeDataKey = this.context.drizzle.contracts['ProofOfEmployment'].methods['checkPolice'].cacheCall(this.props.accounts[0]);
    this.setState({ policeDataKey: policeDataKey });
  }

  componentWillReceiveProps() {
    if (this.state.role !== undefined) {
      return;
    }

    if (
      !this.props.ProofOfEmployment.initialized ||
      !(this.state.federationDataKey in this.props.ProofOfEmployment.federation) ||
      !(this.state.employerDataKey in this.props.ProofOfEmployment.checkEmployer) ||
      !(this.state.bankDataKey in this.props.ProofOfEmployment.checkBank) ||
      !(this.state.housingAuthorityDataKey in this.props.ProofOfEmployment.checkHousingAuthority) ||
      !(this.state.insuranceProviderDataKey in this.props.ProofOfEmployment.checkInsuranceProvider) ||
      !(this.state.policeDataKey in this.props.ProofOfEmployment.checkPolice)
    ) {
      return;
    }

    var federation = this.props.ProofOfEmployment.federation[this.state.federationDataKey].value;
    var employer = this.props.ProofOfEmployment.checkEmployer[this.state.employerDataKey].value;
    var bank = this.props.ProofOfEmployment.checkBank[this.state.bankDataKey].value;
    var housingAuthority = this.props.ProofOfEmployment.checkHousingAuthority[this.state.housingAuthorityDataKey].value;
    var insuranceProvider = this.props.ProofOfEmployment.checkInsuranceProvider[this.state.insuranceProviderDataKey].value;
    var police = this.props.ProofOfEmployment.checkPolice[this.state.policeDataKey].value;
    var myAddr = this.props.accounts[0];

    var role = 'Employee/Landlord';
    if (federation === myAddr) {
      role = 'Federation';
    } else if (employer) {
      role = 'Employer';
    } else if (bank) {
      role = 'Bank';
    } else if (housingAuthority) {
      role = 'HousingAuthority';
    } else if (insuranceProvider) {
      role = 'InsuranceProvider';
    } else if (police) {
      role = 'Police';
    }

    this.setState({ role: role });
  }

  render() {
    if (this.state.role === undefined) {
      return <span>Loading...</span>;
    }

    var myAddr = this.props.accounts[0];
    var role = this.state.role;
    let self = this;

    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <h1>Crypto Lodging</h1>
          </div>

          <div className="pure-u-1-1">
            <h2>Active Account</h2>
            <Blockies seed={myAddr} size={10} scale={10} />
            <AccountData accountIndex="0" units="ether" precision="3" />

            {role === 'Employee/Landlord' && (
              <div>
                <a>Enter as: </a>
                <button onClick={(e) => self.setState({ role: 'Employee' })}>Employee</button>
                <a> / </a>
                <button onClick={(e) => self.setState({ role: 'Landlord' })}>Landlord</button>
              </div>
            )}
            {role !== 'Employee/Landlord' && (
              <p>
                <strong>Role</strong>: {role}
              </p>
            )}
            <br />
            <br />
          </div>

          <div className="pure-u-1-1">
            <h2>Contract actions</h2>
            {role === 'Federation' && (
              <div>
                <p>
                  <strong>Add Role</strong>:
                </p>
                <FederationSelect />
              </div>
            )}
            {role === 'Landlord' && (
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
            )}

            <br />
            <br />
          </div>

          <div className="pure-u-1-1">
            {role === 'Federation' && <h2>Events</h2>}
            {role === 'Employer' && <h2>Events</h2>}
            {role === 'Employee' && <h2>Data Requests</h2>}
            {role === 'Landlord' && <h2>Data Approvals</h2>}
            <EventsContainer role={role} />
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
