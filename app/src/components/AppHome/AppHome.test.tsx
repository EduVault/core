import { render, screen } from '@testing-library/react';
import { WrapProviders } from '../..';
import { AppHome } from './AppHome';

test('renders AppHome', () => {
  render(
    <WrapProviders>
      <AppHome></AppHome>
    </WrapProviders>
  );
  const homeText = screen.getByText('logged in to app');
  expect(homeText).toBeVisible();
});
