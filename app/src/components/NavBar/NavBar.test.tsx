import { fireEvent, render, screen } from '@testing-library/react';
import { WrapProviders } from '../..';
import { NavBar, links } from './NavBar';

test('renders NavBar, toggler, and logo', () => {
  render(
    <WrapProviders>
      <NavBar></NavBar>
    </WrapProviders>
  );
  const navBarToggle = screen.getByTestId('nav-drawer-toggle');
  expect(navBarToggle).toBeVisible();
  const logo = screen.getByTestId('nav-eduvault-logo');
  expect(logo).toBeVisible();
});

test('opens drawer', () => {
  render(
    <WrapProviders>
      <NavBar></NavBar>
    </WrapProviders>
  );
  const notNavDrawerList = screen.queryByTestId('nav-drawer-list');
  expect(notNavDrawerList).not.toBeInTheDocument();
  const navBarToggle = screen.getByTestId('nav-drawer-toggle');
  fireEvent.click(navBarToggle);
  const navDrawerList = screen.getByTestId('nav-drawer-list');
  expect(navDrawerList).toBeVisible();
});

test.each(links)('Check if Nav Bar has %s link.', (link) => {
  render(
    <WrapProviders>
      <NavBar></NavBar>
    </WrapProviders>
  );
  const navBarToggle = screen.getByTestId('nav-drawer-toggle');
  fireEvent.click(navBarToggle);
  const linkDom = screen.getByText(link.text);
  expect(linkDom).toHaveAttribute('href', link.location);
});
