import { Router } from 'express';

import { API_ROUTES } from '../config';
import { respond } from '../helpers';
import { checkAuth } from '../middleware';
import { AuthCheckRes } from './types';

const authCheck = (router: Router) => {
  router.get(API_ROUTES.AUTH_CHECK, checkAuth, (req, res) => {
    const response: AuthCheckRes = 'authenticated';
    respond(res)(response);
  });
};
export default authCheck;
