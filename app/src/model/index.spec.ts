import { eduvault } from './auth';

it('loads eduvault and mock server', async () => {
  const pingRes = await eduvault.api.ping();
  expect(pingRes).toBe(true);
}, 20000);
