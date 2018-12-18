import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { TripFilter } from './TripFilter';

const clickFn = jest.fn();
const mockLocations = {
  from: [],
  to: []
}

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(<TripFilter onChange={clickFn} locations={mockLocations} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
