import { drizzleConnect } from "drizzle-react";
import DrawerUI from "./DrawerUI";

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    PatentHub: state.contracts.PatentHub,
    drizzleStatus: state.drizzleStatus
    // contracts: state.contracts
  };
};

const DrawerUIContainer = drizzleConnect(DrawerUI, mapStateToProps);

export default DrawerUIContainer;
