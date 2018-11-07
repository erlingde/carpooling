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
      selectedFrom: ['Any'],
      selectedTo: ['Any']
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

  handleFromFilterChange = (value) => {
    if (value[0] === 'Any') {
      value[0] = value.pop();
    } else if (value.length === 0) {
      value.push('Any');  
    }

    this.setState({
      selectedFrom: value
    });
  }

  handleToFilterChange = (value) => {
    if (value[0] === 'Any') {
      value[0] = value.pop();
    } else if (value.length === 0) {
      value.push('Any');  
    }

    this.setState({
      selectedTo: value
    });
  }

  render() {
    const { filter, fetchedRideRequests, fetchedPassengerRequests, locations, selectedFrom, selectedTo } = this.state;
    const { handleFromFilterChange, handleToFilterChange } = this;

    return (
      <div className="App">
        <header className="App-header">
          <Row type="flex" justify="center">
            <Col span={12}>
              <h1 style={{color: 'yellow'}}>
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
                onChange={handleFromFilterChange}
                value={selectedFrom}
                allowClear={true}
                maxTagCount={2}
                defaultValue={'All'}
              >
                {locations.map((item) =>
                  <Select.Option key={item}>{item}</Select.Option>
                )}
              </Select>
              </Col>
              <Col span={6}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="To"
                onChange={handleToFilterChange}
                value={selectedTo}
                allowClear={true}
                maxTagCount={2}
              >
                {locations.map((item) =>
                  <Select.Option key={item}>{item}</Select.Option>
                )}
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
