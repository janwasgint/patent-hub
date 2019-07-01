import React, {
  Component
} from "react";
import PropTypes from "prop-types";

class DrawerUI extends Component {
  constructor(props) {
    super(props);
  }

  sendTo() {
    console.log("Hello");
  }

  render() {
    return ( <
      div >
      Hi im a drawer <
      /div>
    );
  }
}
export default DrawerUI;