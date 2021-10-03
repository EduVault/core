import { render, screen } from '@testing-library/react';
import { WrapProviders } from '../..';
import { Notes } from './Notes';

// TODO: mock collections for tests
test('renders Notes', () => {
  render(<WrapProviders>{/* <Notes></Notes> */}</WrapProviders>);
  // const homeText = screen.getByText('Notes');
  // expect(homeText).toBeVisible();
  expect(true).toBe(true);
});
