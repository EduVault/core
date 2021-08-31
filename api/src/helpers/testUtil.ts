import { Database } from '@textile/threaddb';
import { Express } from 'express';
import supertest from 'supertest';

import { app } from '../';
import { ROUTES } from '../config';
import { clearCollections, newLocalDB } from '../db';
import passportInit from '../auth/passportInit';
import { formatPasswordSignIn } from './';
import { ApiRes, PasswordLoginRes } from '../types';
import routerInit from '../routes';

export { default as supertest } from 'supertest';
export { Express } from 'express';

export const password = 'Password123';
export const username = 'person@email.com';

export const setupApp = async () => {
  const db = await newLocalDB('eduvault-test');
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
/** Sends a password signup/login request */
export const pwAuthTestReq = async (
  options: {
    username?: string;
    password?: string;
    redirectURL?: string;
    appID?: string;
  },
  agent: supertest.SuperAgentTest
) => {
  // console.log('pwAuthTestReq', options.appID);
  const personAuthReq = await formatPasswordSignIn(options);
  // console.log({ personAuthReq });
  const res = await agent
    .post(ROUTES.api.PASSWORD_AUTH)
    .send(personAuthReq)
    .set('Accept', 'application/json');

  return res as PwResponse;
};

export const pwAuthWithCookie = async (
  req: supertest.Test,
  agent: supertest.SuperAgentTest
) => {
  const res = await pwAuthTestReq({ password, username }, agent);
  const cookie: string = res.headers['set-cookie'];
  req.set('Cookie', cookie);
  return await req;
};
