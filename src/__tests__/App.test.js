import React from 'react';
import { render } from 'react-testing-library';
import App from '../App';

describe('<App />', () => {
  it('should render hello world', () => {
    const { getByText } = render(<App />);
    expect(getByText('Search Marvels API!')).toBeInTheDocument();
  });
});
