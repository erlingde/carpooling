import React from 'react';
import propTypes from 'prop-types';
import { Tooltip, Radio, Icon } from 'antd';

const Filterbutton = ({title, value, tripFilter, type}) => {
    return (
        <Tooltip title={title}>
            <Radio.Button value={value} checked={tripFilter === 'ride' ? true : false}>
                {type}
                <Icon type={value === 'ride' ? 'car' : 'user-add'} style={{'marginLeft': '6px'}}/>
            </Radio.Button>
        </Tooltip>
    );
}

Filterbutton.propTypes = {
    title: propTypes.string,
    value: propTypes.string,
    tripFilter: propTypes.string,
    type: propTypes.string
};

export default Filterbutton;