import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { FilterButton } from './FilterButton';

const clickFn = jest.fn();

describe('FilterButton', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<FilterButton onRadioFilterChange={clickFn} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  /*test('Link changes the class when hovered', () => {
    const component = renderer.create(
      <FilterButton onRadioFilterChange={clickFn} />,
    );
    
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  
    // manually trigger the callback
    tree.props.onMouseEnter();
    // re-rendering
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  
    // manually trigger the callback
    tree.props.onMouseLeave();
    // re-rendering
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });*/
  
});