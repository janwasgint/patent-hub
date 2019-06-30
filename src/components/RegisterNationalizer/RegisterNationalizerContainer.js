import RegisterNationalizer from './RegisterNationalizer';
import { drizzleConnect } from 'drizzle-react';

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    PatentHub: state.contracts.PatentHub,
    drizzleStatus: state.drizzleStatus
    // contracts: state.contracts
  };
};

const RegisterNationalizerContainer = drizzleConnect(RegisterNationalizer, mapStateToProps);

export default RegisterNationalizerContainer;
