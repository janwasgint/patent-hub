import React, { Component } from "react";
import PropTypes from "prop-types";

class SharesProposalForm extends Component {
  constructor(props) {
    super(props);
  }

  testInventors = ["A", "B", "C", "D", "E"];

  listInventors() {
    let inventors = [];
    for (var i = 0; i < this.testInventors.length; i++) {
      inventors.push(
        <div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label className="input-group-text" for="inputGroupSelect01">
                {this.testInventors[i]}
              </label>
            </div>
            <input
              type="number"
              className="form-control"
              placeholder="Contribution in %"
            />
          </div>
        </div>
      );
    }
    return inventors;
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <form>
          <div> {this.listInventors()}</div>
          <p />
          <div className="row">
            <div className="col">
              <button
                type="button"
                className="form-control btn btn-primary"
                onClick={this.props.propose}
              >
                Propose
              </button>
            </div>
            <div className="col">
              <button
                type="button"
                className="form-control btn btn-danger"
                onClick={this.props.cancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default SharesProposalForm;
