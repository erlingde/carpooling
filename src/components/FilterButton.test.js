import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { FilterButton } from './FilterButton';

const clickFn = jest.fn();

describe('FilterButton', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<FilterButton onRadioFilterChange={clickFn} />, div);
  });
});