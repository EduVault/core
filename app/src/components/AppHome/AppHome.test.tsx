import { render, screen } from '@testing-library/react';
import { AppHome } from './AppHome';

test('renders AppHome', () => {
  render(<AppHome></AppHome>);
  const homeText = screen.getByText('logged in to app');
  expect(homeText).toBeVisible();
});
