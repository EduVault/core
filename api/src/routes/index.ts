import { Database } from '@textile/threaddb';
import { PassportStatic } from 'passport';
import express from 'express';

import passwordRoute from './password';
import appAuthRoute from './appAuth';

import authCheck from './authCheck';
import getJwt from './getJwt';

const routerInit = (
  app: express.Application,
  passport: PassportStatic,
  db: Database
) => {
  const router = express.Router();
  router.get('/ping', (req, res) => res.json({ code: 200, content: 'pong' }));

  passwordRoute(router, db);
  appAuthRoute(router, passport);

  authCheck(router);
  getJwt(router);

  app.use('/api', router);
  return router;
};

export default routerInit;
