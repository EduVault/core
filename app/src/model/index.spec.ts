import { eduvault } from './';
it('loads eduvault and mock server', () => {
  expect(eduvault.api.ping()).toBeTruthy();
});
