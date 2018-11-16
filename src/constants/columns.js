import React from 'react';

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

  export default columns;