import { render, screen } from '@testing-library/react';
import { WrapProviders } from '../..';
import { HomePage } from './HomePage';

test('renders HomePage', () => {
  render(
    <WrapProviders>
      <HomePage></HomePage>
    </WrapProviders>
  );
  const homeText = screen.getByText('welcome to eduvault home page');
  expect(homeText).toBeVisible();
});
