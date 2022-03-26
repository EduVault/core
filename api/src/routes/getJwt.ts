import { Router } from 'express';

import { API_ROUTES } from '../config';
import { respond } from '../helpers';
import { checkAuth } from '../middleware';

const getJwt = (router: Router) => {
  router.get(API_ROUTES.GET_JWT, checkAuth, (req, res) => {
    respond(res)({
      jwt: req.session.jwt,
      oldJwt: req.session.oldJwt ? req.session.oldJwt : null,
    });
  });
};
export default getJwt;
