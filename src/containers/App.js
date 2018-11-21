import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Radio, Select, Table, Icon, Tooltip, Layout } from 'antd';
import _ from 'lodash';

import api from '../services/api';
import scraper from '../services/scraper';

import columns from '../constants/columns'

import './App.css';
import apisLogo from '../assets/apis.png';

const { Header, Footer, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);

    this.selectedFilterFrom = [];
    this.selectedFilterTo = [];
    this.refreshTimer = 5;
    
    this.state = {
      tripFilter: 'ride',
      fetchedPassengerRequests: [],
      fetchedRideRequests: [],
      locations: [],
      filteredTrips: [],
      tableLoading: true,
      refreshIconHover: false,
      refreshIconClicked: false,
      secondsUntilRefresh: 5,
      windowWidth: window.innerWidth
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

  handleRefreshHoverEnter = (event) => {
    const { refreshIconClicked } = this.state;

    if (refreshIconClicked) {
      return;
    }

    this.setState({
      refreshIconHover: true
    });
  }

  handleRefreshHoverLeave = (event) => {
    this.setState({
      refreshIconHover: false
    });
  }

  handleFilterChange = (value, type) => {
    const { filterLocations } = this;

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

  handleRefreshClick = () => {
    const { refreshIconClicked } = this.state;
    const { fetchData } = this;

    if (refreshIconClicked) {
      return;
    }

    this.setState({
      refreshIconClicked: true
    }, async () => {
      const timer = await setInterval(() => {
        this.setState({
          secondsUntilRefresh: --this.refreshTimer
        });
        if (this.refreshTimer === 0) {
          clearInterval(timer);
        }
      }, 1000);
      
      await setTimeout(() => {
        this.refreshTimer = 5;
        this.setState({
          refreshIconClicked: false,
          secondsUntilRefresh: 5
        });
      }, 5000);
      
    });
    
    fetchData();
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
    const { populateLocations, filterRequestDates } = this;

    this.selectedFilterFrom = [];
    this.selectedFilterTo = [];

    this.setState({
      tableLoading: true,
      refreshIconHover: false
    }, async () => {
      await api.fetchRideRequests().then(res => {
        let driverRequests = res[0].data.results;
        let passengerRequests = res[1].data.results;
  
        passengerRequests = filterRequestDates(passengerRequests);
        driverRequests = filterRequestDates(driverRequests);

        [...driverRequests, ...passengerRequests].forEach((item) => {
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

  filterRequestDates = (data) => {
    return _.remove(data, (item) => !moment(item.date, 'YYYYY-MM-DD').isValid() || moment(item.date, 'YYYYY-MM-DD').year() < moment(Date.now()).year() + 4);
  }

  updateWidth = () => {
    this.setState({
      windowWidth: window.innerWidth
    });
  }

  render() {
    const { filteredTrips, locations, tableLoading, refreshIconHover, refreshIconClicked, secondsUntilRefresh } = this.state;
    const { handleFilterChange, onRadioChange, handleRefreshHoverEnter, handleRefreshHoverLeave, tripFilter, selectedFilterFrom, selectedFilterTo, handleRefreshClick } = this;

    return (
      <div className="App">
        <Layout style={{backgroundColor: 'grey', minHeight: '100vh', fontSize: 'calc(10px + 2vmin)'}}>
          <Header style={{backgroundColor: 'grey', lineHeight: window.innerWidth < 500 ? '40px' : '64px'}}>
            <Row type="flex" justify="center"  style={{margin: '10px 0'}}>
              <Col xs={24} md={20} lg={18} xl={14}>
                <h1  style={{margin: '10px 0'}}>
                  Carpooling in Iceland
                </h1>
              </Col>
            </Row>
          </Header>
          <Content>
            <Row type="flex" style={{marginTop: '40px'}} align='middle'>
              <Col xs={{ span: 8, offset: 8 }}>
                <Radio.Group size={window.innerWidth < 600 ? 'small' : 'large'} onChange={onRadioChange} defaultValue="ride" buttonStyle="solid" style={{'verticalAlign': 'top'}}>
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
              </Col>
              <Col xs={{span: 1, offset: 7}} md={{span: 1, offset: 5}} lg={{span: 1, offset: 4}} xl={{span: 1, offset: 2}}>
                <Tooltip title={refreshIconClicked ? `Available to refresh in ${secondsUntilRefresh}s` : 'Refresh'}>
                  <Icon
                    type="sync"
                    spin={refreshIconHover}
                    style={refreshIconClicked ? {float: 'right', marginRight: '6px', cursor: 'not-allowed'} : { float: 'right', marginRight: '6px' , cursor: 'pointer'}}
                    onClick={handleRefreshClick}
                    onMouseEnter={handleRefreshHoverEnter}
                    onMouseLeave={handleRefreshHoverLeave}
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
                  style={{ 'backgroundColor': '#e9ebee' }}
                  size={window.innerWidth < 600 ? 'small' : 'default'}
                  onRow={record => {
                    return {
                      onMouseEnter: async () => {
                        if (!record.details) {
                          await api.fetchURL(record.link).then(res => {
                            record.details = scraper.scrapeHtml(res.data);
                            this.forceUpdate();
                          });
                        }
                      }
                    }
                  }}
                />
              </Col>
            </Row>
          </Content>
          <Footer style={{ bottom: '0', width: '100vw', fontSize: '12px', borderTop: 'solid 1px black' }}>
            <Row type="flex" justify="center" gutter={16} align="middle">
              <Col className="gutter-row" span={6}>
                <a className='footer_link' href='http://www.samferda.net/' rel="noopener noreferrer" target="_blank">
                  <i className="fas fa-taxi" style={{ fontSize: '2em' }} />
                </a>
              </Col>
              <Col className="gutter-row" span={6}>
                <a className='footer_link' href='https://github.com/erlingde/carpooling' rel="noopener noreferrer" target="_blank">
                  <i className="fab fa-github" style={{ fontSize: '2em' }} />
                </a>
              </Col>
              <Col className="gutter-row" span={6}>
                <a className='footer_link' href='https://www.apis.is' rel="noopener noreferrer" target="_blank">
                  <img src={apisLogo} alt="apis.is" style={{ height:'1.6em', width:'1.6em', verticalAlign: 'sub' }}></img>
                </a>
              </Col>
            </Row>
          </Footer>
        </Layout>
 
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWidth);
    this.fetchData();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWidth);
}
}

export default App;
