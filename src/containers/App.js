import React, { Component } from 'react';
import { Button, Collapse, Row, Col, Radio, Menu, Icon, Dropdown } from 'antd';
import axios from 'axios';

import './App.css';
import Panel from '../components/Panel';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'passenger',
      fetchedPassengerRequests: [],
      fetchedRideRequests: [],
      locations: []
    };

    this.callback = this.callback.bind(this);
  };

  callback = function(key) {
    console.log(key);
  }
  


  onRadioChange = (event) => {
    this.setState((state) => {
      return {filter: event.target.value}
    })
  }

  render() {
    let { onRadioChange, callback } = this;
    let { filter, fetchedRideRequests, fetchedPassengerRequests, locations } = this.state;

    const menu = (
      <Menu>
        {locations.map((item) => 
          <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/" key={item}>{item}</a>
          </Menu.Item>
        )}
      </Menu>
    );

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
            <Col span={6}>
              <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" href="#">
                  From <Icon type="down" />
                </a>
              </Dropdown>
            </Col>
            <Col span={6}>
              <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" href="#">
                  To <Icon type="down" />
                </a>
              </Dropdown>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={12}>
              <Panel 
                filter={filter}
                rides={fetchedRideRequests}
                passengers={fetchedPassengerRequests}
              />
            </Col>
          </Row>
        </header>
      </div>
    );
  }

  componentDidMount() {
    axios.get(`http://apis.is/rides/samferda-drivers/`)
      .then(res => {
        let results = res.data.results;
        let tempLocations = [];

        results.forEach((item) => {
          if (!tempLocations.find((x) => item.from === x)) {
            tempLocations.push(item.from);
          } else if (!tempLocations.find((x) => item.to === x)) {
            tempLocations.push(item.to);
          }
        });

        console.log(tempLocations);

        this.setState({
          fetchedRideRequests: results,
          locations: tempLocations
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
