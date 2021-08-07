import {
  setupApp,
  // closeApp,
  supertest,
  // Express,
  // https
} from './testUtil';

describe('Loads .env', () => {
  let request: () => supertest.SuperTest<supertest.Test>;
  // let agent: supertest.SuperAgentTest;
  // let app: Express;
  // let server: https.Server;

  beforeAll(() => {
    const setup = setupApp();
    request = setup.request;
    // agent = setup.agent;
    // app = setup.app;
    // server = setup.server;
  });

  afterAll(async () => {
    // await closeApp({ app });
  });

  it('loads .env', async () => {
    const res = await request().get('/dotenv-check').send();
    // console.log('ping test result', result);
    expect(res.status).toEqual(200);
    expect(res.body.DOTENV_TEST).toEqual('working');
  });
  it('loads PORT', async () => {
    const res = await request().get('/dotenv-check').send();
    // console.log('ping test result', result);
    expect(res.status).toEqual(200);
    expect(res.body.PORT_API).toEqual(5555);
  });
});
