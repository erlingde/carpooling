import React, { Component } from 'react';
import { Button, Collapse, Row, Col, Radio, Menu, Icon, Dropdown, AutoComplete, Select } from 'antd';
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

    /*const menu = (
      <Menu>
        {locations.map((item) => 
          <Menu.Item key={item}>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">{item}</a>
          </Menu.Item>
        )}
      </Menu>
    );*/

    const menu = (
      <Menu>
        {locations.map((item) => 
          <Menu.Item key={item}><Icon type="user" />{item}</Menu.Item>
        )}
      </Menu>
    );    

    const children = [];

    locations.map((item) =>
      children.push(<Select.Option key={item}>{item}</Select.Option>)
    )

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
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="From"
              >
                {children}
              </Select>
              </Col>
              <Col span={6}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="To"
              >
                {children}
              </Select>
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
          if (item.from !== "" && !tempLocations.find((x) => item.from === x)) {
            tempLocations.push(item.from);
          } else if (item.to !== "" && !tempLocations.find((x) => item.to === x)) {
            tempLocations.push(item.to);
          }
        });

        this.setState({
          fetchedRideRequests: results,
          locations: tempLocations.sort()
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
