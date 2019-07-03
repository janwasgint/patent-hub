import Inventor from './Inventor';
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

const InventorContainer = drizzleConnect(Inventor, mapStateToProps);

export default InventorContainer;
