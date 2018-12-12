import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col, Layout, Tooltip } from 'antd';

import TripTable from '../components/TripTable';
import FilterButton from '../components/FilterButton';
import RefreshButton from '../components/RefreshButton';
import TripFilter from '../components/TripFilter';
import CommentButton from '../components/CommentButton';

import api from '../utils/api';
import logos from '../utils/logos.js';

import funkyLines from '../assets/funky-lines.png';

import _ from 'lodash';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.selectedFilterFrom = [];
    this.selectedFilterTo = [];
    this.fetchedPassengerRequests = [];
    this.fetchedRideRequests = [];

    this.state = {
      filteredTrips: [],
      tableLoading: true,
      windowWidth: window.innerWidth,
      locations: {
        from: [],
        to: []
      }
    };
  };

  populateLocations = (results) => {
    let tempFromLocations = [];
    let tempToLocations = [];

    results.forEach((item) => {
      if (item.from !== "" && !tempFromLocations.find((x) => item.from === x)) {
        tempFromLocations.push(item.from);
      } else if (item.to !== "" && !tempToLocations.find((x) => item.to === x)) {
        tempToLocations.push(item.to);
      }
    });
    
    return {
      from: tempFromLocations.sort(),
      to: tempToLocations.sort()
    };
  }

  onRadioFilterChange = (value) => {
    const { fetchedRideRequests, fetchedPassengerRequests } = this;

    this.selectedFilterFrom = [];
    this.selectedFilterTo = [];

    this.setState({
      filteredTrips: value === 'ride' ? fetchedRideRequests : fetchedPassengerRequests
    });
  }

  handleFilterChange = () => {
    this.forceUpdate();
    const filteredLocations = this.filterLocations();
    
    this.setState({
      filteredTrips: filteredLocations
    });
  }

  filterLocations = () => {
    const { selectedFilterFrom, selectedFilterTo, tripFilter } = this.props;
    const { fetchedPassengerRequests, fetchedRideRequests } = this;

    let tempRequests = [];
    const selectedRequest = tripFilter === 'ride' ? fetchedRideRequests : fetchedPassengerRequests;

    if (this.props.selectedFilterFrom.length === 0 && this.props.selectedFilterTo.length === 0) {
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
    const { tripFilter } = this.props;
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

        const locations = populateLocations([...this.fetchedRideRequests, ...this.fetchedPassengerRequests]);
        
        //store.dispatch(addLocations(locations));

        this.setState({
          filteredTrips: tripFilter === 'passenger' ? this.fetchedPassengerRequests : this.fetchedRideRequests,
          tableLoading: false,
          locations: locations
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
  
  updateCallback = () => {
    this.forceUpdate();
  }

  renderHeader = () => {
    return (
      <Layout.Header style={{ padding: '10px', height: '100%', background: 'linear-gradient(to right, #243B55, #141E30)', lineHeight: window.innerWidth < 500 ? '40px' : '64px' }}>
        <Row type="flex" justify="center" >
          <Col xs={22} md={20} lg={18} xl={14}>
            <h1>Carpooling in Iceland</h1>
            <hr className="brace" />
          </Col>
        </Row>
      </Layout.Header>
    );
  }

  renderContent = () => {
    const { filteredTrips, tableLoading, windowWidth, locations } = this.state;
    const { updateCallback, handleFilterChange, onRadioFilterChange, fetchData } = this;

    return (
      <Layout.Content>
        <div className='content' style={ this.props.commentButtonClicked ? '' : { padding: window.innerWidth < 600 ? '10px 5px' : '25px' }}>
          <Row type="flex" align='middle'>
            <Col xs={{ span: 23, offset: 1 }}>
              <CommentButton />
              <FilterButton onRadioFilterChange={onRadioFilterChange} />
              <RefreshButton fetchData={fetchData} />
            </Col>
          </Row>
          <TripFilter onChange={handleFilterChange} locations={locations} />
          <Row type="flex" justify="center">
            <Col xs={24}>
              <TripTable data={filteredTrips} windowWidth={windowWidth} tableLoading={tableLoading} fetchData={fetchData} update={updateCallback} />
            </Col>
          </Row>
        </div>
      </Layout.Content>
    );
  }

  renderInformation = () => {
    return (
      <Row
      key='key'
      type="flex"
      justify="center"
      align="middle"
      style={{
        marginTop: '50px',
        backgroundImage: `url(${funkyLines})`,
        padding: 'calc(35.91549px + 3.75587vw) 10%',
        borderTop: '1px solid black'
      }}>
        <Col xs={24}>
          <h2>
            Technology used
          </h2>
        </Col>
        <Col xs={12} md={8}>
          <div style={{ padding: 'calc(20.25352px + 2.06573vw) calc(11.77465px + 1.12676vw)', display: 'flex' }}>
            <img src={logos.react} alt ='react' style={{ maxHeight: 'calc(20.25352px + 2.06573vw)', maxWidth: 'calc(20.25352px + 2.06573vw)', marginRight: 'calc(8.83099px + .84507vw)' }} />
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
            <img src={logos.redux} alt ='redux' style={{ maxHeight: 'calc(20.25352px + 2.06573vw)', maxWidth: 'calc(20.25352px + 2.06573vw)', marginRight: 'calc(8.83099px + .84507vw)' }} />
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
            <img src={logos.nodeJS} alt ='nodeJS' style={{ maxHeight: 'calc(20.25352px + 2.06573vw)', maxWidth: 'calc(20.25352px + 2.06573vw)', marginRight: 'calc(8.83099px + .84507vw)' }} />
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
            <img src={logos.circleCI} alt ='circleci' style={{ maxHeight: 'calc(20.25352px + 2.06573vw)', maxWidth: 'calc(20.25352px + 2.06573vw)', marginRight: 'calc(8.83099px + .84507vw)' }} />
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
            <img src={logos.webpack} alt ='webpack' style={{ maxHeight: 'calc(20.25352px + 2.06573vw)', maxWidth: 'calc(20.25352px + 2.06573vw)', marginRight: 'calc(8.83099px + .84507vw)' }} />
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
            <img src={logos.storybook} alt ='storybook' style={{ maxHeight: 'calc(20.25352px + 2.06573vw)', maxWidth: 'calc(20.25352px + 2.06573vw)', marginRight: 'calc(8.83099px + .84507vw)' }} />
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
      <Layout.Footer style={{ fontSize: '12px', borderTop: 'solid 2px black', backgroundColor: '#141E30' }}>
        <Row type="flex" justify="center" gutter={16} align="middle">
          <Col className="gutter-row" xs={8} md={3}>
            <a className='footer_link' href='http://www.samferda.net/' rel="noopener noreferrer" target="_blank">
              <i className="fas fa-taxi" style={{ fontSize: '2em' }} />
            </a>
          </Col>
          <Col className="gutter-row" xs={8} md={3}>
            <a className='footer_link' href='https://www.apis.is' rel="noopener noreferrer" target="_blank">
              <img src={logos.apisLogo} alt="apis.is" style={{ height:'2em', width:'2em', verticalAlign: 'sub' }}></img>
            </a>
          </Col>
          <Col className="gutter-row" xs={8} md={3}>
            <a className='footer_link' href='https://github.com/erlingde/carpooling' rel="noopener noreferrer" target="_blank">
              <i className="fab fa-github" style={{ fontSize: '2em' }} />
            </a>
          </Col>
        </Row>
      </Layout.Footer>
    );
  }

  render() {
    console.log('rendering');
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

const mapStateToProps = state => {
  return {
    tripFilter: state.ui.filter.request,
    selectedFilterFrom: state.ui.filter.locations.from,
    selectedFilterTo: state.ui.filter.locations.to,
    commentButtonClicked: state.ui.buttons.commentButtonClicked
  }
}

export default connect(mapStateToProps)(App);
