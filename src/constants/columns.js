import React from 'react';
import { Icon, Tooltip } from 'antd';

const columns = [{
    title: 'From',
    dataIndex: 'from',
    key: 'from'
  }, {
    title: 'To',
    dataIndex: 'to',
    key: 'to'
  }, {
    title: 'Date',
    key: 'date',
    dataIndex: 'date'
  }, {
    title: () => (
      <span>
        <Tooltip title="Time">
          <Icon type="clock-circle"/>
        </Tooltip>
      </span>
    ),
    key: 'time',
    dataIndex: 'time'
  }, {
    title: 'Details',
    key: 'link',
    dataIndex: 'link',
    className: 'detailsCol',
    render: (text, record) => (
      <span>
        <Tooltip placement="right" title={record.details ? record.details : <Icon type="loading" style={{ fontSize: 16 }} spin />}>
          <a href={record.link} rel="noopener noreferrer" target="_blank">
            <Icon type="info-circle" style={{ fontSize: '18px', color: 'red' }} />
          </a>
        </Tooltip>
      </span>
    )
  }];

  export default columns;