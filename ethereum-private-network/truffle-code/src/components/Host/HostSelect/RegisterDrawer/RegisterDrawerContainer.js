import { drizzleConnect } from 'drizzle-react';

import RegisterDrawer from './RegisterDrawer';

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    PatentHub: state.contracts.PatentHub,
    drizzleStatus: state.drizzleStatus
    // contracts: state.contracts
  };
};

const RegisterDrawerContainer = drizzleConnect(RegisterDrawer, mapStateToProps);

export default RegisterDrawerContainer;
