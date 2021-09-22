import { eduvault } from './';
it('loads eduvault and mock server', () => {
  expect(eduvault.pingServer()).toBeTruthy();
});
