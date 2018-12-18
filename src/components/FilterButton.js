import React from 'react';
import { connect } from "react-redux";
import propTypes from 'prop-types';
import { Tooltip, Radio, Icon } from 'antd';

import store from '../redux/store';
import { setRequestType } from '../redux/actions';

export const FilterButton = ({ onRadioFilterChange }) => {
    const onRadioChange = (event) => {
        store.dispatch(setRequestType(event.target.value));
        onRadioFilterChange(event.target.value);
    }

    return (
        <Radio.Group size={window.innerWidth < 600 ? 'small' : 'large'} onChange={onRadioChange} defaultValue="ride" buttonStyle="solid" style={{'verticalAlign': 'top'}}>
            <Tooltip title="Passengers seeking rides">
                <Radio.Button value="ride" >
                    Ride
                    <Icon type='car' style={{ 'marginLeft': '6px' }}/>
                </Radio.Button>
            </Tooltip>
            <Tooltip title="Drivers seeeking passengers">
                <Radio.Button value="passenger">
                    Passengers
                    <Icon type='user-add' style={{ 'marginLeft': '6px' }}/>
                </Radio.Button>
            </Tooltip>
        </Radio.Group>
    );
}

FilterButton.propTypes = {
    title: propTypes.string,
    value: propTypes.string,
    type: propTypes.string,
    request: propTypes.string
};

const mapDispatchToProps = dispatch => {
    return {
        setRequestType: request => {
            dispatch(setRequestType(request))
        }
    }
}
export default connect(null, mapDispatchToProps)(FilterButton);