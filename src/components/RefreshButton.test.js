import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { RefreshButton } from './RefreshButton';

const clickFn = jest.fn();

describe('RefreshButton', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<RefreshButton onRadioFilterChange={clickFn} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});