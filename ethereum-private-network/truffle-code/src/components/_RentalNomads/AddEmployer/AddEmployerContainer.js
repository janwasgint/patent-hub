import AddEmployer from './AddEmployer';
import { drizzleConnect } from 'drizzle-react';

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    ProofOfEmployment: state.contracts.ProofOfEmployment,
    drizzleStatus: state.drizzleStatus
    // contracts: state.contracts
  };
};

const AddEmployerContainer = drizzleConnect(AddEmployer, mapStateToProps);

export default AddEmployerContainer;
