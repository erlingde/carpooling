import React, { Component } from 'react';
import { connect } from "react-redux";
import { Select, Row, Col } from 'antd';
import PropTypes from 'prop-types';

import store from '../redux/store';
import { setFromLocationFilter, setToLocationFilter } from '../redux/actions';

export class TripFilter extends Component {
  handleOnChange = async (value, type) =>  {
    const { onChange } = this.props;

    if (type === 'from') {
      await store.dispatch(setFromLocationFilter(value))
    } else {
      await store.dispatch(setToLocationFilter(value))
    }
    onChange();
  }

  render() {
    const { locations } = this.props;
    
    return (
      <Row type="flex" justify="center">
        <Col xs={12}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="From"
            onChange={value => this.handleOnChange(value, 'from')}
            allowClear={true}
            maxTagCount={2}
          >
            {locations.from.map((item) =>
              <Select.Option key={item}>{item}</Select.Option>
            )}
          </Select>
        </Col>
        <Col xs={12}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="To"
            onChange={value => this.handleOnChange(value, 'to')}
            allowClear={true}
            maxTagCount={2}
          >
            {locations.to.map((item) =>
              <Select.Option key={item}>
                {item}
              </Select.Option>
            )}
          </Select>
        </Col>
      </Row>
    );
  }
};

TripFilter.propTypes = {
  locations: PropTypes.object,
  onChange: PropTypes.func
}

const mapDispatchToProps = dispatch => {
  return {
    setFromLocationFilter: filter => {
      dispatch(setFromLocationFilter(filter))
    },
    setToLocationFilter: filter => {
      dispatch(setToLocationFilter(filter))
    }
  }
}

export default connect(null, mapDispatchToProps)(TripFilter);