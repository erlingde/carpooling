import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Radio, Select, Table, Icon, Tooltip, Layout } from 'antd';

import api from '../utils/api';
import scraper from '../utils/scraper';

import columns from '../constants/columns'

import './App.css';
import apisLogo from '../assets/apis2.png';
import circleCI from '../assets/circleci.svg';
import redux from '../assets/redux.svg';
import react from '../assets/react.svg';
import nodeJS from '../assets/nodejs.svg';
import webpack from '../assets/webpack.svg';
import storybook from '../assets/storybook.png';

import _ from 'lodash';


const { Header, Footer, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);

    this.selectedFilterFrom = [];
    this.selectedFilterTo = [];
    this.refreshTimer = 5;
    this.locations = [];
    this.fetchedPassengerRequests = [];
    this.fetchedRideRequests = [];

    this.state = {
      tripFilter: 'ride',
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
    const { fetchedRideRequests, fetchedPassengerRequests } = this;

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
    const { tripFilter } = this.state;
    const { selectedFilterFrom, selectedFilterTo, fetchedPassengerRequests, fetchedRideRequests } = this;

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
        const driverRequests = res[0].data.results;
        const passengerRequests = res[1].data.results;
  
        this.fetchedPassengerRequests = filterRequestDates(passengerRequests);
        this.fetchedRideRequests = filterRequestDates(driverRequests);

        [...this.fetchedPassengerRequests, ...this.fetchedRideRequests].forEach((item) => {
          item.key = item.link
        });
  
        this.locations = populateLocations([...this.fetchedRideRequests, ...this.fetchedPassengerRequests], []).sort();

        this.setState({
          filteredTrips: tripFilter === 'passenger' ? this.fetchedPassengerRequests : this.fetchedRideRequests,
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

  renderHeader = () => {
    return (
      <Header style={{ height: '100%', background: 'linear-gradient(to right, #243B55, #141E30)', lineHeight: window.innerWidth < 500 ? '40px' : '64px'}}>
        <Row type="flex" justify="center"  style={{ margin: '10px 0' }}>
          <Col xs={24} md={20} lg={18} xl={14}>
            <h1 style={{ margin: '10px 0', color:'white' }}>
              Carpooling in Iceland
            </h1>
          </Col>
        </Row>
      </Header>
    );
  }

  renderContent = () => {
    const { filteredTrips, tableLoading, refreshIconHover, refreshIconClicked, secondsUntilRefresh } = this.state;
    const { handleFilterChange, onRadioChange, handleRefreshHoverEnter, handleRefreshHoverLeave, tripFilter, selectedFilterFrom, selectedFilterTo, handleRefreshClick, fetchData, locations } = this;

    return (
    <Content>
      <div style={{ display: 'inline-block', border: '1px solid black', borderRadius: '10px', background: '#e9ebee', padding: window.innerWidth < 600 ? '10px 5px' : '25px', boxShadow: '5px 10px',  }}>
        <Row type="flex" align='middle'>
          <Col xs={{ span: 23, offset: 1 }}>
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
          <Col xs={12}>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="From"
              onChange={value => handleFilterChange(value, 'from')}
              value={selectedFilterFrom}
              allowClear={true}
              maxTagCount={2}
            >
              {locations.map((item) =>
                <Select.Option key={item}>{item}</Select.Option>
              )}
            </Select>
          </Col>
          <Col xs={12}>
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
          <Col xs={24}>
            <Table
              columns={columns}
              dataSource={filteredTrips}
              loading={tableLoading}
              style={{ 'backgroundColor': '#e9ebee' }}
              size={window.innerWidth < 600 ? 'small' : 'middle'}
              onRow={record => {
                return {
                  onMouseEnter: async () => {
                    if (!record.details) {
                      await api.fetchURL(record.link).then(res => {
                        record.details = scraper.scrapeHtml(res.data);
                        if (record.details === undefined) {
                          fetchData();
                        } else {
                          this.forceUpdate();
                        }
                      });
                    }
                  }
                }
              }}
            />
          </Col>
        </Row>
      </div>
    </Content>
    );
  }

  renderInformation = () => {
    return (
      <Row key='key' type="flex" justify="center" align="middle" style={{ marginTop: '50px', backgroundColor: '#e9ebee', padding: 'calc(35.91549px + 3.75587vw) 10%' }}>
        <Col xs={24}>
          <h2>
            Technology used
          </h2>
        </Col>
        <Col xs={12} md={8}>
          <div style={{ padding: 'calc(20.25352px + 2.06573vw) calc(11.77465px + 1.12676vw)', display: 'flex' }}>
            <img src={react} alt ='react' style={{ maxHeight: 'calc(20.25352px + 2.06573vw)', maxWidth: 'calc(20.25352px + 2.06573vw)', marginRight: 'calc(8.83099px + .84507vw)' }} />
            <div>
              <div style={{ fontSize: 'calc(8.83099px + .84507vw)' }}>
                React
              </div>
              <div style={{ fontSize: 'calc(6.53521px + .65728vw)', color: '#6f7489' }}>
                JavaScript library for building user interfaces
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} md={8}>
          <div style={{ padding: 'calc(20.25352px + 2.06573vw) calc(11.77465px + 1.12676vw)', display: 'flex' }}>
            <img src={redux} alt ='redux' style={{ maxHeight: 'calc(20.25352px + 2.06573vw)', maxWidth: 'calc(20.25352px + 2.06573vw)', marginRight: 'calc(8.83099px + .84507vw)' }} />
            <div>
              <div style={{ fontSize: 'calc(8.83099px + .84507vw)' }}>
                Redux
              </div>
              <div style={{ fontSize: 'calc(6.53521px + .65728vw)', color: '#6f7489' }}>
                JavaScript library for managing application state
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} md={8}>
          <div style={{ padding: 'calc(20.25352px + 2.06573vw) calc(11.77465px + 1.12676vw)', display: 'flex' }}>
            <img src={nodeJS} alt ='nodeJS' style={{ maxHeight: 'calc(20.25352px + 2.06573vw)', maxWidth: 'calc(20.25352px + 2.06573vw)', marginRight: 'calc(8.83099px + .84507vw)' }} />
            <div>
              <div style={{ fontSize: 'calc(8.83099px + .84507vw)' }}>
                NodeJS
              </div>
              <div style={{ fontSize: 'calc(6.53521px + .65728vw)', color: '#6f7489' }}>
                Cross-platform JavaScript run-time environment
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} md={8}>
          <div style={{ padding: 'calc(20.25352px + 2.06573vw) calc(11.77465px + 1.12676vw)', display: 'flex' }}>
            <img src={circleCI} alt ='circleci' style={{ maxHeight: 'calc(20.25352px + 2.06573vw)', maxWidth: 'calc(20.25352px + 2.06573vw)', marginRight: 'calc(8.83099px + .84507vw)' }} />
            <div>
              <div style={{ fontSize: 'calc(8.83099px + .84507vw)' }}>
                CircleCI
              </div>
              <div style={{ fontSize: 'calc(6.53521px + .65728vw)', color: '#6f7489' }}>
                Continuous Integration system
              </div>
            </div>
          </div>
        </Col>

        <Col xs={12} md={8}>
          <div style={{ padding: 'calc(20.25352px + 2.06573vw) calc(11.77465px + 1.12676vw)', display: 'flex' }}>
            <img src={webpack} alt ='webpack' style={{ maxHeight: 'calc(20.25352px + 2.06573vw)', maxWidth: 'calc(20.25352px + 2.06573vw)', marginRight: 'calc(8.83099px + .84507vw)' }} />
            <div>
              <div style={{ fontSize: 'calc(8.83099px + .84507vw)' }}>
                Webpack
              </div>
              <div style={{ fontSize: 'calc(6.53521px + .65728vw)', color: '#6f7489' }}>
                JavaScript module bundler
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} md={8}>
        <div style={{ padding: 'calc(20.25352px + 2.06573vw) calc(11.77465px + 1.12676vw)', display: 'flex' }}>
            <img src={storybook} alt ='storybook' style={{ maxHeight: 'calc(20.25352px + 2.06573vw)', maxWidth: 'calc(20.25352px + 2.06573vw)', marginRight: 'calc(8.83099px + .84507vw)' }} />
            <div>
              <div style={{ fontSize: 'calc(8.83099px + .84507vw)' }}>
                Storybook
              </div>
              <div style={{ fontSize: 'calc(6.53521px + .65728vw)', color: '#6f7489' }}>
                UI development environment
              </div>
            </div>
          </div>
        </Col>
      </Row>
    );
  }

  renderFooter = () => {
    return (
      <Footer style={{ fontSize: '12px', borderTop: 'solid 1px black', backgroundColor: '#141E30' }}>
        <Row type="flex" justify="center" gutter={16} align="middle">
          <Col className="gutter-row" xs={8} md={3}>
            <a className='footer_link' href='http://www.samferda.net/' rel="noopener noreferrer" target="_blank">
              <i className="fas fa-taxi" style={{ fontSize: '2em' }} />
            </a>
          </Col>
          <Col className="gutter-row" xs={8} md={3}>
            <a className='footer_link' href='https://www.apis.is' rel="noopener noreferrer" target="_blank">
              <img src={apisLogo} alt="apis.is" style={{ height:'2em', width:'2em', verticalAlign: 'sub' }}></img>
            </a>
          </Col>
          <Col className="gutter-row" xs={8} md={3}>
            <a className='footer_link' href='https://github.com/erlingde/carpooling' rel="noopener noreferrer" target="_blank">
              <i className="fab fa-github" style={{ fontSize: '2em' }} />
            </a>
          </Col>
        </Row>
      </Footer>
    );
  }

  render() {
    return (
      <div className="App">
        <Layout style={{ background: 'linear-gradient(to right, #243B55, #141E30)', minHeight: '100vh', fontSize: 'calc(10px + 2vmin)' }}>
          {this.renderHeader()}
          {this.renderContent()}
          {this.renderInformation()}
          {this.renderFooter()}
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
