import { drizzleConnect } from 'drizzle-react';

import Host from './Host';


// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    PatentHub: state.contracts.PatentHub,
    drizzleStatus: state.drizzleStatus
    // contracts: state.contracts
  };
};

const HostContainer = drizzleConnect(Host, mapStateToProps);

export default HostContainer;
