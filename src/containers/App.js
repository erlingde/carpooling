import React, { Component } from 'react';
import { Row, Col, Radio, Select } from 'antd';
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
      locations: [],
      selectedFrom: [],
      selectedTo: []
    };
  };

  populateLocations = (results, tempLocations) => {
    results.forEach((item) => {
      if (item.from !== "" && !tempLocations.find((x) => item.from === x)) {
        tempLocations.push(item.from);
      } else if (item.to !== "" && !tempLocations.find((x) => item.to === x)) {
        tempLocations.push(item.to);
      }
    });
    return tempLocations;
  }

  render() {
    const { filter, fetchedRideRequests, fetchedPassengerRequests, locations } = this.state;

    /*const menu = (
      <Menu>
        {locations.map((item) => 
          <Menu.Item key={item}>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">{item}</a>
          </Menu.Item>
        )}
      </Menu>
    );

    const menu = (
      <Menu>
        {locations.map((item) => 
          <Menu.Item key={item}><Icon type="user" />{item}</Menu.Item>
        )}
      </Menu>
    );*/    

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
    let tempDriverLocations = [];
    let tempPassengerLocations = [];

    axios.get(`http://apis.is/rides/samferda-drivers/`)
      .then(res => {
        const results = res.data.results;

        tempDriverLocations = this.populateLocations(results, []);
        
        this.setState({
          fetchedRideRequests: results,
          });
      })

      axios.get(`http://apis.is/rides/samferda-passengers/`)
      .then(res => {
        const results = res.data.results;
        
        tempPassengerLocations = this.populateLocations(results, tempDriverLocations);
        
        const totalLocations = [...new Set(tempDriverLocations, tempPassengerLocations)].sort();

        this.setState({
          fetchedPassengerRequests: results,
          locations: totalLocations
        });
      })
  }
}

export default App;
