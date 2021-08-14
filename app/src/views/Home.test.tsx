import { render, screen } from '@testing-library/react';
import Home from './Home';

test('renders Home', () => {
  render(<Home></Home>);
  const homeText = screen.getByText('logged in to home');
  expect(homeText).toBeVisible();
});
