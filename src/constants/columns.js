import React from 'react';
import { Icon, Tooltip } from 'antd';

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
    title: () => (
      <span>
        <Tooltip title="Time">
          <Icon type="clock-circle" style={{'marginLeft': '6px'}}/>
        </Tooltip>
      </span>
    ),
    key: 'time',
    dataIndex: 'time'
  }, {
    title: () => (
      <span>
        <Tooltip title="Information">
          <Icon type="info-circle" style={{'marginLeft': '6px'}}/>
        </Tooltip>
      </span>
    ),
    key: 'link',
    dataIndex: 'link',
    render: (text, record) => (
      <span>
        <a href={record.link} rel="noopener noreferrer" target="_blank">Details</a>
      </span>
    )
  }];

  export default columns;