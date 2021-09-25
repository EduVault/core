import { URL_API } from '../config';
import Eduvault from '@eduvault/sdk-js/dist/main';
const eduvault = new Eduvault({ appID: '1', URL_API, log: true });
it('loads mock server', async () => {
  const pingRes = await eduvault.api.ping();
  expect(pingRes).toBe(true);
}, 20000);
