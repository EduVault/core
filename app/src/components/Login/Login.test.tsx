import { render, screen } from '@testing-library/react';
import { Login } from './Login';

test('renders login', () => {
  render(<Login></Login>);
  const loginText = screen.getByText('login');
  expect(loginText).toBeVisible();
});
