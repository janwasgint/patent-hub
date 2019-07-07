import { drizzleConnect } from 'drizzle-react';

import HostSelect from './HostSelect';

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    PatentHub: state.contracts.PatentHub,
    drizzleStatus: state.drizzleStatus
    // contracts: state.contracts
  };
};

const HostSelectContainer = drizzleConnect(HostSelect, mapStateToProps);

export default HostSelectContainer;
