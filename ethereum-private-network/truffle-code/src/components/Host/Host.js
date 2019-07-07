import React, { Component } from 'react';
import Blockies from 'react-blockies';

import HostSelect from './HostSelect/HostSelectContainer';

class Host extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    // local copy of the events we are interested in
    this.events = {
      participantRegistered: [],
    };

    // fetch all events we have to listen to from the contract
    let propsEvents = this.props.PatentHub.events;

    // iterate all events to get the one we are interested in - participantRegistered(address indexed participant, string role)
    // for events parameters see PatentHub.sol
    for (var i = 0; i < propsEvents.length; i++) {
      if (propsEvents[i].event === 'participantRegistered') {// && propsEvents[i].returnValues.landlord === props.accounts[0]) {
        this.events.participantRegistered.push({
          participant: propsEvents[i].returnValues.participant,
          role: propsEvents[i].returnValues.role,
        });
      }
    }
    console.log(this.events.participantRegistered);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div>
        <div>
          <p>
            <strong>Register Actor</strong>:
          </p>
          <HostSelect />
        </div>

        <p />   
            
        <div className="card">
          <h5 className="card-header">Registered Participants</h5>
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Role</th>
              </tr>
            </thead>
            {this.events.participantRegistered.map(function(event, i) {
                return (
                  <tbody key={i}>
                    <tr>
                      <td>
                        <Blockies seed={event.participant} size={10} scale={10} />
                        {event.participant}
                      </td>
                      <td>{event.role}</td>
                    </tr>
                  </tbody>
                );
              })}
           </table>
        </div>
      </div>
    );
  }
}

export default Host;
