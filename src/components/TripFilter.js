import React from 'react';
import { connect } from "react-redux";
import { Select } from 'antd';
import PropTypes from 'prop-types';

const TripFilter = ({ placeholder, onChange, value, locations }) => {
  return (
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      allowClear={true}
      maxTagCount={2}
    >
      {placeholder === 'From' ? 
        locations.from.map((item) =>
          <Select.Option key={item}>{item}</Select.Option>
        )
        : 
        locations.to.map((item) =>
        <Select.Option key={item}>{item}</Select.Option>
        )
      }
    </Select>
  );
};

TripFilter.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.array
}

const mapStateToProps = state => {
  return { locations: state.locations }
}

export default connect(mapStateToProps)(TripFilter);