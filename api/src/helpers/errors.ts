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
  missingPasswordOrUsername: {
    message: 'missing password or username',
    code: 10000,
    status: 400,
  },
  passportError: {
    message: 'unknown authentication error (passport.js): ',
    code: 10001,
    status: 401,
  },
  signupMissingKeys: {
    message: 'signup data missing DB keys',
    code: 10002,
    status: 400,
  },
  missingPasswordRequestData: {
    message: 'missing password request data',
    code: 10003,
    status: 400,
  },
  authenticationFailed: {
    message: 'authentication failed',
    code: 10004,
    status: 401,
  },
  missingRedirectURL: {
    message: 'missing redirect URL',
    code: 10005,
    status: 400,
  },
};
