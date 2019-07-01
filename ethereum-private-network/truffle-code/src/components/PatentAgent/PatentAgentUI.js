import React, { Component } from "react";
import PropTypes from "prop-types";

class PatentAgentUI extends Component {
  constructor(props) {
    super(props);
  }
  thirdParties = [
    "Drawer",
    "Nationalizer",
    "Translator",
    "Patent Office",
    "Inventors"
  ];

  sendTo() {
    console.log("Hello");
  }

  listInventors() {
    let inventors = [];
    for (var i = 0; i < this.thirdParties.length; i++) {
      inventors.push(
        <div key={i}>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text"> {this.thirdParties[i]}</span>
            </div>
            <textarea
              className="form-control"
              aria-label="With textarea"
            ></textarea>
          </div>
          <div className="custom-file mb-4">
            <button
              className="btn btn-outline-secondary "
              type="button"
              onClick={() => this.sendTo(this.thirdParties[i])}
            >
              Send to {this.thirdParties[i]}
            </button>
          </div>
          <p />
        </div>
      );
    }
    return inventors;
  }

  render() {
    return (
      <div>
        <form>
          <div> {this.listInventors()}</div>
        </form>
      </div>
    );
  }
}
export default PatentAgentUI;
