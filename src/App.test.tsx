import React from 'react';
import { render,  screen } from '@testing-library/react';
import App from './App';
import Adapter from 'enzyme-adapter-react-16';
import {shallow, configure} from 'enzyme';
import { Table } from 'react-bootstrap';
import ReactTestUtils from 'react-dom/test-utils'; 

configure({adapter: new Adapter()});
//Check if button is present 
test('renders check if button is present', () => {
  render(<App />);
  const linkElement = screen.getByText(/Filter/i);
  expect(linkElement).toBeInTheDocument();
});
//If error occurs
it('should show the error if error appears', () => {
  const appComponent = shallow(<App />);
  appComponent.setState({ error: "Has error" });
  expect(appComponent.find('.error').exists()).toBeTruthy()
});


