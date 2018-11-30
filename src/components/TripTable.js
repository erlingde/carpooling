import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';

import api from '../utils/api';
import scraper from '../utils/scraper';

import columns from '../constants/columns'

const TripTable = ({data, windowWidth, tableLoading, fetchData, update}) => {
    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={tableLoading}
            style={{ 'backgroundColor': '#e9ebee' }}
            size={windowWidth < 600 ? 'small' : 'middle'}
            onRow={record => {
                return {
                    onMouseEnter: async () => {
                        if (!record.details) {
                            await api.fetchURL(record.link).then(res => {
                                record.details = scraper.scrapeHtml(res.data);
                                if (record.details === undefined) {
                                    fetchData();
                                } else {
                                    update();
                                }
                            });
                        }
                    }
                }
            }}
        />);
};

TripTable.propTypes = {
    filteredTrips: PropTypes.array,
    windowWidth: PropTypes.number,
    loading: PropTypes.bool,
    fetchData: PropTypes.func,
    update: PropTypes.func
};

export default TripTable;