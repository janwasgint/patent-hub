import { drizzleConnect } from 'drizzle-react';

import Home from './Home';

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    PatentHub: state.contracts.PatentHub,
    drizzleStatus: state.drizzleStatus
    // contracts: state.contracts
  };
};

const HomeContainer = drizzleConnect(Home, mapStateToProps);

export default HomeContainer;
