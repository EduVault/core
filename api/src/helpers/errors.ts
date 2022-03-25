import { Express } from 'express';
/* 
reference https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

commonly used:
400 bad request
401 unauthorized
404 not found
500 internal server error
*/
export const errors = {
  // 400 bad request
  missingPasswordOrUsername: {
    message: 'missing password or username',
    code: 40001,
    status: 400,
  },
  signupMissingKeys: {
    message: 'signup data missing DB keys',
    code: 40002,
    status: 400,
  },
  missingPasswordRequestData: {
    message: 'missing password request data',
    code: 40003,
    status: 400,
  },
  missingRedirectURL: {
    message: 'missing redirect URL',
    code: 40004,
    status: 400,
  },
  incorrectPassword: {
    message: 'incorrect username or password',
    code: 40005,
    status: 400,
  },
  // 401 unauthorized
  passportError: {
    message: 'unknown authentication error (passport.js): ',
    code: 40101,
    status: 401,
  },
  authenticationFailed: {
    message: 'authentication failed',
    code: 40102,
    status: 401,
  },
  unauthorizedAppUrl: {
    message: 'unauthorized redirect URL',
    code: 40103,
    status: 401,
  },
  onlyOfficial: {
    message: 'only official websites can make this request',
    code: 40104,
    status: 401,
  },
  // Internal server error
  personNotFound: {
    message: 'person not found',
    code: 50001,
    status: 500,
  },
};
