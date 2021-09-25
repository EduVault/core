import { render, screen } from '@testing-library/react';
import { WrapProviders } from '../..';
import { Login } from './Login';

test('renders login', () => {
  render(
    <WrapProviders>
      <Login></Login>
    </WrapProviders>
  );
  const loginText = screen.getByText('Continue with Password');
  expect(loginText).toBeVisible();
});
