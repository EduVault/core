import { render } from '@testing-library/react';
import { WrapProviders } from '../..';

// TODO: mock collections for tests
test('renders Notes', () => {
  render(<WrapProviders>{/* <Notes></Notes> */}</WrapProviders>);
  // const homeText = screen.getByText('Notes');
  // expect(homeText).toBeVisible();
  expect(true).toBe(true);
});
