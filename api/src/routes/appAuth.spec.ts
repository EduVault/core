import {
  pwAuthTestReq,
  setupTests,
  formatTestSignIn,
  appAuthTestReq,
  pwAndAppLogin,
} from '../helpers/testUtil';
import { ROUTES } from '../config';

it('Accepts valid app log in', async () => {
  const { agent, request } = await setupTests();
  const loginData = await formatTestSignIn();
  const res = await pwAuthTestReq(loginData, agent);
  const appAuthData = {
    loginToken: res.body.content.loginToken,
    appID: loginData.appID,
  };
  const appLoginRes = await appAuthTestReq(appAuthData, agent);
  // console.log({ appLoginRes: appLoginRes.body });
  expect(appLoginRes.body.code).toBe(200);
  expect(appLoginRes.body.content.jwt.length).toBeGreaterThan(20);
});

it('Authorizes cookie', async () => {
  const { agent, request } = await setupTests();
  const cookie = await pwAndAppLogin(agent);
  const res = await request().get(ROUTES.api.AUTH_CHECK).set('Cookie', cookie);

  expect(res.body.content).toBe('authenticated');
  expect(res.body.code).toEqual(200);
});
