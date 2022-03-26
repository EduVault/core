import {
  setupTests,
  pwAuthTestReq,
  formatTestSignIn,
} from '../helpers/testUtil';
import { hashPassword, validPassword } from '../helpers';
import * as config from '../config';
const { ROUTES } = config;
describe(`POST ${ROUTES.api.PASSWORD_AUTH}`, () => {
  it('hashes and compares passwords correctly', async () => {
    const { agent, request } = await setupTests();

    const initPassword = 'hello123';
    const hashed = hashPassword(initPassword);
    const comparePassword = validPassword(initPassword, hashed);
    expect(comparePassword).toBe(true);
  });

  it('rejects signup with no username', async () => {
    const { agent, request } = await setupTests();

    const loginData = await formatTestSignIn();
    loginData.username = null;
    const res = await pwAuthTestReq(loginData, agent);
    expect(res.status).toEqual(400);
    expect(res.body.content).toEqual('missing password or username');
  });

  it('rejects signup with no password', async () => {
    const { agent, request } = await setupTests();

    const loginData = await formatTestSignIn();
    loginData.username = null;
    const res = await pwAuthTestReq(loginData, agent);
    expect(res.status).toEqual(400);
    expect(res.body.content).toEqual('missing password or username');
  });

  it('Accepts valid signup', async () => {
    const { agent, request } = await setupTests();

    const loginData = await formatTestSignIn();
    const res = await pwAuthTestReq(loginData, agent);
    expect(res.status).toEqual(200);
    expect(res.body.code).toEqual(200);
    expect(res.body.content);
    expect(typeof res.body.content.jwt).toBe('string');
    expect(res.body.content.jwt.length).toBeGreaterThan(10);
    expect(typeof res.body.content.pwEncryptedPrivateKey).toBe('string');
    expect(res.body.content.pwEncryptedPrivateKey.length).toBeGreaterThan(10);
    expect(typeof res.body.content.pubKey).toBe('string');
    expect(res.body.content.pubKey.length).toBeGreaterThan(10);
    expect(typeof res.body.content.threadIDStr).toBe('string');
    expect(res.body.content.threadIDStr.length).toBeGreaterThan(10);
  });

  test.todo('handlelogin callback');
  test.todo('can log back in a second time time');
});
