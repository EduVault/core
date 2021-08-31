import { Router } from 'express';

import { ROUTES } from '../config';
import { respond } from '../helpers';
import { checkAuth } from '../middleware';

const authCheck = (router: Router) => {
  router.get(ROUTES.AUTH_CHECK, checkAuth, (req, res) => {
    respond(res)('authorized');
  });
};
export default authCheck;
