import { render, screen } from '@testing-library/react';
import Home from './HomePage';

test('renders Home', () => {
  render(<Home></Home>);
  const homeText = screen.getByText('welcome to eduvault');
  expect(homeText).toBeVisible();
});
