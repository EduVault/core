import { setupTests } from './helpers/testUtil';
import { ROUTES } from './config';

describe('Loads .env', () => {
  it('loads .env', async () => {
    const { agent, request } = await setupTests();
    const res = await request().get(ROUTES.api.ENV_CHECK).send();
    // console.log('ping test result', result);
    expect(res.status).toEqual(200);
    expect(res.body.ENV_CHECK).toEqual('working');
  });
  it('Pings successfully', async () => {
    const { request } = await setupTests();

    const res = await request().get(ROUTES.api.PING).send();
    // console.log('ping test result', res);
    expect(res.status).toEqual(200);
    expect(res.body.code).toEqual(200);
    expect(res.body.content).toEqual('pong');
  });
});
