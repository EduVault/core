import { Database } from '@textile/threaddb';
import { ROUTES } from '../config';
import {
  setupApp,
  closeApp,
  supertest,
  Express,
  // https
} from '../helpers/testUtil';

describe('Pingger', () => {
  let request: () => supertest.SuperTest<supertest.Test>;
  let agent: supertest.SuperAgentTest;
  let app: Express;
  let db: Database;
  // let server: https.Server;

  beforeAll(async () => {
    const setup = await setupApp();
    request = setup.request;
    agent = setup.agent;
    app = setup.app;
    db = setup.db;
    // server = setup.server;
  });

  afterAll(async () => {
    await closeApp({ app, db });
  });

  it('Pings successfully', async () => {
    const res = await request().get(ROUTES.api.PING).send();
    // console.log('ping test result', result);
    expect(res.status).toEqual(200);
    expect(res.body.code).toEqual(200);
    expect(res.body.content).toEqual('pong');
  });
});
