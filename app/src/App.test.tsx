import { render, screen } from '@testing-library/react';
import App from './App';

test('renders children', () => {
  const Child = <div>hey child</div>;
  render(<App>{Child}</App>);
  const child = screen.getByText('hey child');
  expect(child).toBeInTheDocument();
});
