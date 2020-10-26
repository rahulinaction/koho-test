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

//Checking value gets added in input
it('Value should get added in tesxt area', () => {
  const appComponent = shallow(<App />);
  const sampleJson = '[{"id":"15887","customer_id":"528","load_amount":"$3318.47","time":"2000-01-01T00:00:00Z"},{"id":"30081","customer_id":"154","load_amount":"$1413.18","time":"2000-01-01T01:01:22Z"},]';
  appComponent.setState({ "input": sampleJson });
  expect(appComponent.find('textarea').props().value).toMatch(sampleJson);
});

