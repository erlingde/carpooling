import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from 'antd';

export class RefreshButton extends Component {
  constructor(props) {
    super(props);

    this.refreshTimer = 5;
    this.refreshIconClicked = false;

    this.state = {
      refreshIconHover: false,
      refreshIconClicked: false,
      secondsUntilRefresh: 5,
    }
  }

  handleRefreshClick = () => {
    const { refreshIconClicked } = this.state;
    const { fetchData } = this.props;

    if (refreshIconClicked) {
      return;
    }

    this.setState({
      refreshIconClicked: true,
      refreshIconHover: false
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

  render() {
    const { refreshIconHover, refreshIconClicked, secondsUntilRefresh } = this.state;
    
    return (
      <Tooltip title={refreshIconClicked ? `Available to refresh in ${secondsUntilRefresh}s` : 'Refresh'}>
        <Icon
          type="sync"
          spin={refreshIconHover}
          style={refreshIconClicked ? { float: 'right', marginRight: '6px', cursor: 'not-allowed' } : { float: 'right', marginRight: '6px' , cursor: 'pointer' }}
          onClick={this.handleRefreshClick}
          onMouseEnter={this.handleRefreshHoverEnter}
          onMouseLeave={this.handleRefreshHoverLeave}
        />
      </Tooltip>
    );
  }
}

RefreshButton.propTypes = {
  refetch: PropTypes.func
};

export default RefreshButton;