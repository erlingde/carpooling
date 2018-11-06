import React, { Component } from 'react';
import { Button, Collapse, Row, Col, Radio } from 'antd';
import axios from 'axios';

import logo from '../assets/logo.svg';
import './App.css';

const Panel = Collapse.Panel;

function callback(key) {
  console.log(key);
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentFilter: 'passenger',
      fetchedPassengerRequests: [],
      fetchedRideRequests: []
    };

    this.onRadioChange = this.onRadioChange.bind(this);
  };

  onRadioChange = function(event) {
    this.setState({
      currentFilter: event.target.value
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        <Row type="flex" justify="center">
          <Col span={12}>
            <h1>
              Carpooling
            </h1>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={12}>
            <h1>
              <Radio.Group onChange={this.onRadioChange} defaultValue="passenger" buttonStyle="solid">
                <Radio.Button value="passenger">Passengers</Radio.Button>
                <Radio.Button value="ride">Ride</Radio.Button>
              </Radio.Group>
            </h1>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={12}>


          <Collapse onChange={callback}>
            <Panel header="This is panel header 1" key="1">
              <p>{text}</p>
            </Panel>
            <Panel header="This is panel header 2" key="2">
              <p>{text}</p>
            </Panel>
            <Panel header="This is panel header 3" key="3">
              <p>{text}</p>
            </Panel>
          </Collapse>
          </Col>       
        </Row>
        </header>
      </div>
    );
  }

  componentDidMount() {
    axios.get(`http://apis.is/rides/samferda-drivers/`)
      .then(res => {
        this.setState({
          fetchedRideRequests: res.data.results
        });
      })

      axios.get(`http://apis.is/rides/samferda-passengers/`)
      .then(res => {
        this.setState({
          fetchedPassengerRequests: res.data.results
        });
      })
  }
}

export default App;
