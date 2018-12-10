import React from 'react';
import { Icon, Tooltip } from 'antd';

const columns = [{
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    width: 135
  }, {
    title: 'To',
    dataIndex: 'to',
    key: 'to',
    width: 135
  }, {
    title: 'Date',
    key: 'date',
    dataIndex: 'date',
    width: 100
  }, {
    title: 'Time',
    key: 'time',
    dataIndex: 'time',
    className: 'colCenter',
    width: 50,
    render: (text, record) => (
      <span>
        <Tooltip placement="right" title={record.time === '' ? 'Anytime' : record.time}>
          <Icon type="clock-circle" style={{ fontSize: '18px' }} />
        </Tooltip>
      </span>
    )
  }, {
    title: 'Details',
    key: 'link',
    dataIndex: 'link',
    className: 'colCenter',
    width: 60,
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