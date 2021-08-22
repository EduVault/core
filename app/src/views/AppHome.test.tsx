import { render, screen } from '@testing-library/react';
import Home from './HomePage';

test('renders Home', () => {
  render(<Home></Home>);
  const homeText = screen.getByText('logged in to app');
  expect(homeText).toBeVisible();
});
