import React, { Component } from "react";
import PropTypes from "prop-types";

class ProposeSharesForm extends Component {
  constructor(props) {
    super(props);

    this.state = { shares: [] };
  }

  inventors = this.props.inventors;

  handleSubmit = e => {
    e.preventDefault();

    let inventors = this.inventors.map((inventor, index) => {
      inventor.push(e.target[index].value);
      return inventor;
    });
    this.props.propose(inventors);
  };

  listInventors() {
    let inventorShares = [];
    for (var i = 0; i < this.inventors.length; i++) {
      inventorShares.push(
        <div key={i}>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label className="input-group-text" htmlFor="inputGroupSelect01">
                {this.inventors[i][0]}
              </label>
            </div>
            <input
              required="true"
              type="number"
              className="form-control"
              placeholder="Contribution in %"
            />
          </div>
        </div>
      );
    }
    return inventorShares;
  }

  render() {
    console.log("props:", this.props);
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div> {this.listInventors()}</div>
          <p />
          <div className="row">
            <div className="col">
              <button type="submit" className="form-control btn btn-primary">
                Propose
              </button>
            </div>
            <div className="col">
              <button
                type="button"
                className="form-control btn btn-danger"
                onClick={this.props.hide}
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

export default ProposeSharesForm;
