import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

const TripFilter = ({placeholder, onChange, value, locations}) => {
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
      {locations.map((item) =>
        <Select.Option key={item}>{item}</Select.Option>
      )}
    </Select>
  );
};

TripFilter.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.array
}

export default TripFilter;