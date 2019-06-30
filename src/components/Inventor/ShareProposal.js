import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ShareProposal extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  render() {
    return (
      <div>

<div className="card">
  <h5 className="card-header">Share Proposal</h5>
  <div className="card-body">
    <h5 className="card-title">InventorXYZ proposed the following share of contributions:</h5>
<p className="card-text">
    <div className="progress">
      <div className="progress-bar" role="progressbar" style={{width: '15%'}} aria-valuenow="15" aria-valuemin="0" aria-valuemax="100">A: 15</div>
      <div className="progress-bar bg-warning" role="progressbar" style={{width: '15%'}} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">B: 15</div>
      <div className="progress-bar bg-info" role="progressbar" style={{width: '70%'}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">XYZ: 70</div>
    </div>
</p>
    <form>
      <div className="row">
        <div className="col">
          <button type="button" className="form-control btn btn-success">Accept</button>
        </div>
        <div className="col">
          <button type="button" className="form-control btn btn-danger">Reject</button>
        </div>
        <div className="col">
          <button type="button" className="form-control btn btn-secondary">New</button>
        </div>
      </div>
    </form>
  </div>
</div>

<p />

<div className="card">
  <h5 className="card-header">Salary Proposal</h5>
  <div className="card-body">
    <h5 className="card-title">PatentAgentX proposed the following Salary:</h5>
<p className="card-text">
<div className="alert alert-dark" role="alert"> Gimme $$$</div>
</p>
    <form>
      <div className="row">
        <div className="col">
          <button type="button" className="form-control btn btn-success">Accept</button>
        </div>
        <div className="col">
          <button type="button" className="form-control btn btn-danger">Reject</button>
        </div>
      </div>
    </form>
  </div>
</div>

<p />

<div className="card">
  <h5 className="card-header">Upload contributions</h5>
  <div className="card-body">
    <form>
    <div className="form-group">
      <input type="file" class="form-control-file" id="exampleFormControlFile1" />
    </div>
    </form>
  </div>
</div>


      </div>
    );
  }
}

export default ShareProposal;
