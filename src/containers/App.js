import React, { Component } from 'react';
import { Row, Col, Radio, Select, Table, Divider, Tag } from 'antd';
import axios from 'axios';

import './App.css';
import Panel from '../components/Panel';

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
      tableLoading: true
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

  render() {
    const { filteredTrips, locations, selectedFrom, selectedTo, tableLoading } = this.state;
    const { handleFromFilterChange, handleToFilterChange, onRadioChange } = this;

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
              <h1>
                <Radio.Group onChange={onRadioChange} defaultValue="passenger" buttonStyle="solid">
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
    const { populateLocations } = this;
    let tempDriverLocations = [];
    let tempPassengerLocations = [];

    axios.get(`http://apis.is/rides/samferda-drivers/`)
      .then(res => {
        let results = res.data.results;

        results.forEach((item) => {
          item.key = item.link
        });

        tempDriverLocations = populateLocations(results, []);

        this.setState({
          fetchedRideRequests: results
          });
      })

      axios.get(`http://apis.is/rides/samferda-passengers/`)
      .then(res => {
        let results = res.data.results;
        let totalLocations;

        results.forEach((item) => {
          item.key = item.link
        });

        tempPassengerLocations = populateLocations(results, tempDriverLocations);
        
        totalLocations = [...new Set(tempDriverLocations, tempPassengerLocations)].sort();
        
        this.setState({
          fetchedPassengerRequests: results,
          filteredTrips: results,
          locations: totalLocations,
          tableLoading: false
        });

      })
  }
}

const columns = [{
  title: 'From',
  dataIndex: 'from',
  key: 'from',
}, {
  title: 'To',
  dataIndex: 'to',
  key: 'to',
}, {
  title: 'Date',
  key: 'date',
  dataIndex: 'date',
}, {
  title: 'Time',
  key: 'time',
  dataIndex: 'time'
}, {
  title: 'Details',
  key: 'link',
  dataIndex: 'link',
  render: (text, record) => (
    <span>
      <a href={record.link} rel="noopener noreferrer" target="_blank">Details</a>
    </span>
  )
}];

export default App;
