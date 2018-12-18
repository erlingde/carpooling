import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { TripTable } from './TripTable';

const clickFn = jest.fn();

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(<TripTable onRadioFilterChange={clickFn} />, div);
});
