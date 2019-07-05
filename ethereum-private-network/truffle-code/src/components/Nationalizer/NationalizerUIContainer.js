import { drizzleConnect } from "drizzle-react";
import NationalizerUI from "./NationalizerUI";

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    PatentHub: state.contracts.PatentHub,
    drizzleStatus: state.drizzleStatus
    // contracts: state.contracts
  };
};

const NationalizerUIContainer = drizzleConnect(NationalizerUI, mapStateToProps);

export default NationalizerUIContainer;
