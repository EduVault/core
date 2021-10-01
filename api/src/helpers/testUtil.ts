import { Database } from '@textile/threaddb';
import { Express } from 'express';
import supertest from 'supertest';
import http from 'http';

import { app as testApp } from '../';
import * as config from '../config';
const { ROUTES } = config;
import { clearCollections, newLocalDB, populateDB } from '../db';
import passportInit from '../auth/passportInit';
import { formatPasswordSignIn } from './';
import {
  ApiRes,
  AppAuthRes,
  PasswordLoginReq,
  PasswordLoginRes,
} from '../types';
import routerInit from '../routes';
import { cors, waitForDbReady } from '../middleware';

export { default as supertest } from 'supertest';
export { Express } from 'express';

export const password = 'Password123';
export const username = 'person@email.com';
export const appID = '1';
export const personID = 'abc';

export const setupTests = async () => {
  let app = testApp;
  const db = newLocalDB('eduvault-test');
  await db.open(2);
  await populateDB(db);
  app.use(await cors(db));

  app.use(waitForDbReady(db));
  const passport = passportInit(app, db);
  routerInit(app, passport, db);
  // const server = startServer();
  const request = () => supertest(app);
  const agent = supertest.agent(app);
  // console.log(`test app listening`);
  return { request, agent, app, db };
};

export const closeApp = async ({ app, db }: { app: Express; db: Database }) => {
  try {
    // await server.close();
    // await server.removeAllListeners();
    await clearCollections(db);
    await app.removeAllListeners();
  } catch (error) {
    console.log('error closing', { error });
  }
};

interface PwResponse extends supertest.Response {
  body: ApiRes<PasswordLoginRes>;
}
interface AppAuthResponse extends supertest.Response {
  body: ApiRes<AppAuthRes>;
}

export const formatTestSignIn = async (options?: {
  username?: string;
  password?: string;
  redirectURL?: string;
  appID?: string;
}) => {
  const loginOptions: {
    username: string;
    password: string;
    redirectURL: string;
    appID: string;
  } = {
    username: options?.username ?? username,
    password: options?.password ?? password,
    redirectURL: options?.redirectURL ?? 'http://localhost',
    appID: options?.appID ?? '1',
  };
  return (await formatPasswordSignIn(loginOptions)) as PasswordLoginReq;
};

/** Sends a password signup/login request */
export const pwAuthTestReq = async (
  personAuthReq: {
    username?: string;
    password?: string;
    redirectURL?: string;
    appID?: string;
  },
  agent: supertest.SuperAgentTest
) => {
  const res = await agent
    .post(ROUTES.api.PASSWORD_AUTH)
    .send(personAuthReq)
    .set('Accept', 'application/json');
  return res as PwResponse;
};

export const appAuthTestReq = async (
  appAuthReq: {
    loginToken?: string;
    appID?: string;
  },
  agent: supertest.SuperAgentTest
) => {
  const res = await agent
    .post(ROUTES.api.APP_AUTH)
    .send(appAuthReq)
    .set('Accept', 'application/json');
  return res as AppAuthResponse;
};

/**
 * @summary sends a password login request, then an app login request, fully singing in the person
 * @param nextReq the next request to be made, which will carry an authorized correct cookie
 * @returns a request that has not been called yet, that include a verified cookie
 */
export const pwAndAppLogin = async (agent: supertest.SuperAgentTest) => {
  const loginData = await formatTestSignIn();
  const res = await pwAuthTestReq(loginData, agent);

  const appAuthData = {
    loginToken: res.body.content.loginToken,
    appID: loginData.appID,
  };
  const appLoginRes = await appAuthTestReq(appAuthData, agent);
  // console.log({ appLoginRes: appLoginRes.body, appAuthData });
  const cookie: string = appLoginRes.headers['set-cookie'];
  // console.log({ cookie });
  return cookie;
};
