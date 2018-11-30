import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from 'antd';

const RefreshButton = ({refreshIconClicked, secondsUntilRefresh, spin, onClick, onMouseEnter, onMouseLeave }) => {
  return (
    <Tooltip title={refreshIconClicked ? `Available to refresh in ${secondsUntilRefresh}s` : 'Refresh'}>
      <Icon
        type="sync"
        spin={spin}
        style={refreshIconClicked ? { float: 'right', marginRight: '6px', cursor: 'not-allowed' } : { float: 'right', marginRight: '6px' , cursor: 'pointer' }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </Tooltip>
  );
}

RefreshButton.propTypes = {
  refreshIconClicked: PropTypes.bool,
  secondsUntilRefresh: PropTypes.number,
  spin: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default RefreshButton;