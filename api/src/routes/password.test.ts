import { Express } from 'express';
import { Database } from '@textile/threaddb';
// import websockify from 'koa-websocket';
import supertest from 'supertest';
import * as http from 'http';

import {
  setupApp,
  pwAuthTestReq,
  pwAuthWithCookie,
  closeApp,
} from '../helpers/testUtil';
import { hashPassword, validPassword } from '../helpers';
import { ROUTES } from '../config';

const password = 'Password123';
const username = 'person@email.com';

describe(`POST 'api/auth/password'`, () => {
  // test util startup teardown boilerplate
  let db: Database;
  let request: () => supertest.SuperTest<supertest.Test>;
  let agent: supertest.SuperAgentTest;
  let app: Express;
  let server: http.Server;

  beforeEach(async () => {
    const setup = await setupApp();
    db = setup.db;
    request = setup.request;
    agent = setup.agent;
    app = setup.app;
    // server = setup.server;
  });
  afterEach(async () => {
    await closeApp({ app, db });
  });

  it('hashes and compares passwords correctly', () => {
    const initPassword = 'hello123';
    const hashed = hashPassword(initPassword);
    const comparePassword = validPassword(initPassword, hashed);
    expect(comparePassword).toBe(true);
  });

  it('rejects signup with no username', async () => {
    const res = await pwAuthTestReq({ password, username: null }, agent);
    expect(401);
    expect(res.body.content).toEqual('missing password or username');
  });

  it('rejects signup with no password', async () => {
    const res = await pwAuthTestReq({ password: null, username }, agent);
    expect(401);
    expect(res.body.content).toEqual('missing password or username');
  });

  it('Accepts valid signup', async () => {
    const res = await pwAuthTestReq({ password, username }, agent);
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

  it('Accepts valid sign in', async () => {
    const res = await pwAuthTestReq({ password, username }, agent);
    expect(res.body.code).toEqual(200);
    expect(res.body.content);
    expect(res.headers['set-cookie'][0]).toContain('eduvault.session=');
  });

  it('Authorizes cookie', async () => {
    const res = await pwAuthTestReq({ password, username }, agent);
    expect(res.body.code).toEqual(200);
    expect(res.body.content);
    expect(res.headers['set-cookie'][0]).toContain('eduvault.session=');
    const cookie = res.headers['set-cookie'];

    const req = request().get('/api' + ROUTES.AUTH_CHECK);
    req.set('Cookie', cookie);

    const secondRes = await req;
    expect(secondRes.body.content).toBe('authorized');
    expect(secondRes.body.code).toEqual(200);
  });

  it('Can get jwts', async () => {
    const res = await pwAuthWithCookie(
      request().get('/api' + ROUTES.GET_JWT),
      agent
    );
    expect(res.status).toEqual(200);
    expect(res.body.code).toEqual(200);
    expect(res.body.content).toHaveProperty('jwt');
    expect(typeof res.body.content.jwt).toBe('string');
    expect(res.body.content.jwt.length).toBeGreaterThan(10);
  });
});
