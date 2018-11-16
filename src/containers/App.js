import React, { Component } from 'react';
import { Row, Col, Radio, Select, Table, Icon } from 'antd';

import api from '../services/api';
import columns from '../constants/columns'

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tripFilter: 'passenger',
      fetchedPassengerRequests: [],
      fetchedRideRequests: [],
      locations: [],
      filteredTrips: [],
      selectedFrom: [],
      selectedTo: [],
      tableLoading: true,
      refreshIconHover: false
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
    const { filterLocations } = this;

    const filteredLocations = filterLocations(value, 'from');

    this.setState({
      selectedFrom: value,
      filteredTrips: filteredLocations
    });
  }

  handleToFilterChange = (value) => {
    const { filterLocations } = this;
    
    const filteredLocations = filterLocations(value, 'to');

    this.setState({
      selectedTo: value,
      filteredTrips: filteredLocations
    });
  }

  onRadioChange = (event) => {
    const { fetchedRideRequests, fetchedPassengerRequests } = this.state;

    this.setState({ 
      selectedFrom: [],
      selectedTo: [],
      filteredTrips: event.target.value === 'ride' ? fetchedRideRequests : fetchedPassengerRequests,
      tripFilter: event.target.value
    });
  }
  
  handleRefreshClick = (event) => {
    console.log(event);
  }

  handleRefreshHover = (event) => {
    const { refreshIconHover } = this.state;

    this.setState({
      refreshIconHover: !refreshIconHover
    });
  }

  filterLocations = (value, tripWay) => {
    const { tripFilter, fetchedPassengerRequests, fetchedRideRequests } = this.state;
    let tempRequests = [];

    if (value.length === 0) {
      return tripFilter === 'passenger' ? fetchedPassengerRequests : fetchedRideRequests;
    }
    
    if (tripFilter === 'ride') {
      fetchedRideRequests.forEach((location) => value.find((item) => {
        if (tripWay === 'from' ? item === location.from : item === location.to) {
          tempRequests.push(location);
        }
        return null;
      }));
    } else {
      fetchedPassengerRequests.forEach((location) => value.find((item) => {
        if (tripWay === 'from' ? item === location.from : item === location.to) {
          tempRequests.push(location);
        }
        return null;
      }));
    }

    return tempRequests;
  }

  fetchData = async () => {
    const { populateLocations, tripFilter } = this;

    this.setState({
      fetchedPassengerRequests: [],
      fetchedRideRequests: [],
      selectedFrom: [],
      selectedTo: [],
      filteredTrips: [],
      tableLoading: true
    });

    await api.fetchRideRequests().then(res => {
      let driverRequests = res[0].data.results;
      let passengerRequests = res[1].data.results;

      [...passengerRequests, ...driverRequests].forEach((item) => {
        item.key = item.link
      });

      const totalLocations = populateLocations([...driverRequests, ...passengerRequests], []);

      this.setState({
        fetchedPassengerRequests: passengerRequests,
        fetchedRideRequests: driverRequests,
        filteredTrips: tripFilter === 'passenger' ? passengerRequests : driverRequests,
        locations: totalLocations.sort(),
        tableLoading: false
      });
    });
  }

  render() {
    const { filteredTrips, locations, selectedFrom, selectedTo, tableLoading, refreshIconHover } = this.state;
    const { handleFromFilterChange, handleToFilterChange, onRadioChange, fetchData, handleRefreshHover } = this;

    return (
      <div className="App">
        <header className="App-header">
          <Row type="flex" justify="center">
            <Col span={12}>
              <h1 style={{color: 'yellow', borderBottom: '1px solid yellow'}}>
                Carpooling in Iceland
              </h1>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={12}>
              <Radio.Group onChange={onRadioChange} defaultValue="ride" buttonStyle="solid" style={{'verticalAlign': 'top'}}>
                <Radio.Button value="ride">Ride</Radio.Button>
                <Radio.Button value="passenger">Passengers</Radio.Button>
              </Radio.Group>
              <Icon
                type="reload"
                spin={refreshIconHover}
                style={{ 'float': 'right','marginRight': '15px' , 'cursor': 'pointer'}}
                onClick={fetchData}
                onMouseEnter={handleRefreshHover}
                onMouseLeave={handleRefreshHover}
              />
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
              <Table
                columns={columns}
                dataSource={filteredTrips}
                loading={tableLoading}
                style={{'backgroundColor': '#e9ebee'}}
              />
            </Col>
          </Row>
        </header>
      </div>
    );
  }

   componentDidMount() {
    const { fetchData } = this;

    fetchData();
  }
}

export default App;
