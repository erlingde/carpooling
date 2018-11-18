import React, { Component } from 'react';
import { Row, Col, Radio, Select, Table, Icon, Tooltip } from 'antd';

import api from '../services/api';
import columns from '../constants/columns'

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.selectedFilterFrom = [];
    this.selectedFilterTo = [];
    
    this.state = {
      tripFilter: 'ride',
      fetchedPassengerRequests: [],
      fetchedRideRequests: [],
      locations: [],
      filteredTrips: [],
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

  onRadioChange = (event) => {
    const { fetchedRideRequests, fetchedPassengerRequests } = this.state;

    this.selectedFilterFrom = [];
    this.selectedFilterTo = [];

    this.setState({
      filteredTrips: event.target.value === 'ride' ? fetchedRideRequests : fetchedPassengerRequests,
      tripFilter: event.target.value
    });
  }

  handleRefreshHover = (event) => {
    const { refreshIconHover } = this.state;

    this.setState({
      refreshIconHover: !refreshIconHover
    });
  }

  handleFilterChange = (value, type) => {
    const { filterLocations } = this;
    console.log(value);
    console.log(type);

    if (type === 'from') {
      this.selectedFilterFrom = value;
    } else {
      this.selectedFilterTo = value;
    }

    const filteredLocations = filterLocations(type);

    this.setState({
      filteredTrips: filteredLocations
    });
  }

  filterLocations = (type) => {
    const { tripFilter, fetchedPassengerRequests, fetchedRideRequests } = this.state;
    const { selectedFilterFrom, selectedFilterTo } = this;

    let tempRequests = [];
    const selectedRequest = tripFilter === 'ride' ? fetchedRideRequests : fetchedPassengerRequests;
    
    if (selectedFilterFrom.length === 0 && selectedFilterTo.length === 0) {
      return tripFilter === 'passenger' ? fetchedPassengerRequests : fetchedRideRequests;
    }

    selectedRequest.forEach(item => {
      if (selectedFilterFrom.length !== 0 && selectedFilterTo.length !== 0) {
        if ((selectedFilterFrom.includes(item.from) && selectedFilterTo.includes(item.to))) {
          tempRequests.push(item);
        }
      } else {
          if (selectedFilterFrom.includes(item.from) || (selectedFilterTo.includes(item.to))) {
            tempRequests.push(item);
          }
        }
    });

    return tempRequests;
  }

  fetchData = () => {
    const { tripFilter } = this.state;
    const { populateLocations } = this;

    this.setState({                     // Resets the state to handle refetching of data
      fetchedPassengerRequests: [],
      fetchedRideRequests: [],
      selectedFrom:   [],
      selectedTo: [],
      filteredTrips: [],
      tableLoading: true
    }, async () => {
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
    });
  }

  render() {
    const { filteredTrips, locations, tableLoading, refreshIconHover } = this.state;
    const { handleFilterChange, onRadioChange, fetchData, handleRefreshHover, tripFilter, selectedFilterFrom, selectedFilterTo } = this;

    return (
      <div className="App">
        <header className="App-header">
          <Row type="flex" justify="center">
            <Col xs={24} md={20} lg={18} xl={14}>
              <h1 style={{color: 'yellow', borderBottom: '1px solid yellow'}}>
                Carpooling in Iceland
              </h1>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xs={24} md={20} lg={18} xl={14}>
              <Radio.Group size="large" onChange={onRadioChange} defaultValue="ride" buttonStyle="solid" style={{'verticalAlign': 'top'}}>
              <Tooltip title="Passengers seeking rides">
                  <Radio.Button value="ride" checked={tripFilter === 'ride' ? true : false}>
                    Ride
                    <Icon type="car" style={{'marginLeft': '6px'}}/>
                  </Radio.Button>
              </Tooltip>
              <Tooltip title="Drivers seeking passengers">
                  <Radio.Button value="passenger"checked={tripFilter === 'passenger' ? true : false}>
                      Passengers
                      <Icon type="user-add" style={{'marginLeft': '6px'}}/>
                    </Radio.Button>
              </Tooltip>
              </Radio.Group>
              <Tooltip title="Refresh">
                <Icon
                  type="sync"
                  spin={refreshIconHover}
                  style={{ 'float': 'right','marginRight': '15px' , 'cursor': 'pointer'}}
                  onClick={fetchData}
                  onMouseEnter={handleRefreshHover}
                  onMouseLeave={handleRefreshHover}
                />
              </Tooltip>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xs={12} md={10} lg={9} xl={7}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="From"
                onChange={value => handleFilterChange(value, 'from')}
                value={selectedFilterFrom}
                allowClear={true}
                maxTagCount={2}
                defaultValue={'All'}
              >
                {locations.map((item) =>
                  <Select.Option key={item}>{item}</Select.Option>
                )}
              </Select>
            </Col>
            <Col xs={12} md={10} lg={9} xl={7}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="To"
                onChange={value => handleFilterChange(value, 'to')}
                value={selectedFilterTo}
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
            <Col xs={24} md={20} lg={18} xl={14}>
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
    this.fetchData();
  }
}

export default App;
