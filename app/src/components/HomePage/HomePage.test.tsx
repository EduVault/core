import { render, screen } from '@testing-library/react';
import { HomePage } from './HomePage';

test('renders HomePage', () => {
  render(<HomePage></HomePage>);
  const homeText = screen.getByText('welcome to eduvault');
  expect(homeText).toBeVisible();
});
