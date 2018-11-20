import React from 'react';
import { Icon, Tooltip, Divider, Popover } from 'antd';

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
    render: (text, record) => (
      <span>
        <a href={record.link} rel="noopener noreferrer" target="_blank">Samferða</a>
        <Divider type="vertical" />
        <Popover content={record.details ? record.details : <Icon type="loading" style={{ fontSize: 16 }} spin />}>
          <Icon type="info-circle"/>
        </Popover>
      </span>
    )
  }];

  export default columns;