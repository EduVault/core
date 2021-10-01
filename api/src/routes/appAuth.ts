import { Router, Response, Request } from 'express';
import passport from 'passport';

import { API_ROUTES } from '../config';
import { AppAuthRes, AppPerson } from '../types';
import { respond, respondError, sessionLogin } from '../helpers';
import { restrictToOfficialApp } from '../middleware';

/** Accepts appLoginToken and appID. Compares token. Issues JWT and cookie.
 * Restricted to official app (http://eduvault.org)
 */
const appAuth = function (router: Router, passport: passport.PassportStatic) {
  // workaround because passport custom's callbacks don't have the full middleware available
  let request: Request;
  let response: Response;
  let storedNext: (...args: any) => any;
  router.post(
    API_ROUTES.APP_AUTH,
    restrictToOfficialApp,
    (req, res, next) => {
      request = req;
      response = res;
      storedNext = next;
      next();
    },
    passport.authenticate(
      'app-auth',
      (error: string | undefined, appPerson: AppPerson) => {
        if (error) return respondError(response, 'passportError', error);
        sessionLogin({ req: request, res: response, appPerson });
        storedNext();
      }
    ),
    (req, res) => {
      const returnData: AppAuthRes = {
        jwt: req.session.jwt,
        oldJwt: req.session.oldJwt,
      };
      // console.log({ returnData });
      return respond(res)(returnData);
    }
  );

  return router;
};
export default appAuth;
