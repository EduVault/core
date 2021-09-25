import { render, screen } from '@testing-library/react';
import { WrapProviders } from '.';
import App from './App';

test('renders children', () => {
  const Child = <div>hey child</div>;
  render(
    <WrapProviders>
      <App>{Child}</App>
    </WrapProviders>
  );
  const child = screen.getByText('hey child');
  expect(child).toBeInTheDocument();
});
