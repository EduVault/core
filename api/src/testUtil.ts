import { Express } from 'express';
// import https from 'https';
import supertest from 'supertest';

import { app, startServer } from './index';

export { default as supertest } from 'supertest';
export { Express } from 'express';
// export { default as https } from 'https';

export const password = 'Password123';
export const username = 'person@email.com';
export const setupApp = () => {
  app.removeAllListeners();
  // const server = startServer();
  const request = () => supertest(app);
  const agent = supertest.agent(app);
  console.log(`test app listening`);
  return { request, agent, app };
};

export const closeApp = async ({
  app,
}: // server,
{
  app: Express;
  // server: https.Server;
}) => {
  try {
    // await server.close();
    // await server.removeAllListeners();
    await app.removeAllListeners();
  } catch (error) {
    console.log('error closing', { error });
  }
};
