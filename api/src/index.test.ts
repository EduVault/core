import { Database } from '@textile/threaddb';
import {
  closeApp,
  setupApp,
  supertest,
  Express,
  // https
} from './helpers/testUtil';

describe('Loads .env', () => {
  let request: () => supertest.SuperTest<supertest.Test>;
  let db: Database;

  // let agent: supertest.SuperAgentTest;
  let app: Express;
  // let server: https.Server;

  beforeAll(async () => {
    const setup = await setupApp();
    request = setup.request;
    db = setup.db;
    // agent = setup.agent;
    app = setup.app;
    // server = setup.server;
  });

  afterAll(async () => {
    await closeApp({ app, db });
  });

  it('loads .env', async () => {
    const res = await request().get(ROUTES.ENV_CHECK).send();
    // console.log('ping test result', result);
    expect(res.status).toEqual(200);
    expect(res.body.ENV_CHECK).toEqual('working');
  });
});
