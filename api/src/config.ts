import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import session from 'express-session';

const env = process.env;
export const NODE_ENV = env.NODE_ENV;
export const dev = NODE_ENV === 'development';
export const unitTest = env.TEST_ENV === 'unit'; // no SSL
export const e2eTest = env.TEST_ENV === 'e2e'; // no SSL (SSL through docker)
/** this is only for 'real' production/staging not including e2e */
export const prod = !dev && !unitTest && !e2eTest; // don't rely on NODE_ENV for this, because sometimes in e2e it will set to 'production'.

dotenv.config({
  path: path.join(__dirname, dev ? '../../dev.env' : '../../.env'),
});

export const HOST = env.HOST;
export const PORT_API_HTTP = Number(env.PORT_API_HTTP);
export const PORT_API_HTTPS = Number(env.PORT_API_HTTPS);
export const DOMAIN_APP = dev
  ? 'http://localhost:3000'
  : `http://${HOST}:${PORT_API_HTTP}`;

export const useHttps = unitTest ? false : env.USE_HTTPS === 'true';

// just to check .env file loads
export const ENV_CHECK = env.ENV_CHECK;
export const APP_SECRET = env.APP_SECRET || 'super-secret';

const SSLKeyPath = path.join(__dirname, '../../deploy/certs/key.pem');
const SSLCertPath = path.join(__dirname, '../../deploy/certs/cert.pem');

export const SSL_KEY = useHttps ? fs.readFileSync(SSLKeyPath) : null;

export const SSL_CERT = useHttps ? fs.readFileSync(SSLCertPath) : null;

export const TEXTILE_USER_API_KEY = env.TEXTILE_USER_API_KEY;
export const TEXTILE_USER_API_SECRET = env.TEXTILE_USER_API_SECRET;

export const SESSION_OPTIONS: session.SessionOptions = {
  secret: APP_SECRET,
  name: 'eduvault.session',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 2 /** two days */,
    httpOnly: useHttps,
    secure: true,
    sameSite: useHttps ? 'none' : null,
  },
  saveUninitialized: false,
  resave: false,
  rolling: true,
  proxy: !useHttps,
};

/** MAKE SURE THESE MATCH eduvault/sdk-js/src/config.ts */
export const API_ROUTES = {
  // implemented:
  /** GET */
  PING: '/ping',
  /** GET */
  ENV_CHECK: '/env-check',
  /** GET */
  AUTH_CHECK: '/auth-check',
  /** GET */
  GET_JWT: '/get-jwt',
  /** POST */
  PASSWORD_AUTH: '/auth/password',
  APP_AUTH: '/auth/app',

  // TODO:
  VERIFY_JWT: '/verify-jwt',
  LOGOUT: '/logout',
  GET_PERSON: '/get-person',

  FACEBOOK_AUTH: '/auth/facebook',
  FACEBOOK_AUTH_CALLBACK: '/auth/facebook/callback',
  GOOGLE_AUTH: '/auth/google',
  GOOGLE_AUTH_CALLBACK: '/auth/google/callback',
  DOTWALLET_AUTH: '/auth/dotwallet',

  APP_TOKEN_ISSUE: '/auth/app/issue-token',
  APP_REGISTER: '/app/register',
  APP_UPDATE: '/app/update',
  DEV_VERIFY: '/dev/verify',

  TEXTILE_RENEW: '/renew-textile',
};

const addApiPrefix = (routes: typeof API_ROUTES) => {
  const routesWithPrefix = { ...routes };
  Object.entries(routes).forEach(
    ([key, route]: [keyof typeof API_ROUTES, string]) =>
      (routesWithPrefix[key] = '/api' + route)
  );
  return routesWithPrefix;
};

/**
 * @example ROUTES.api.PING => '/api/ping'
 */
export const ROUTES = {
  api: addApiPrefix(API_ROUTES),
};

/** expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d" */
export const JWT_EXPIRY = '30d';

console.log({
  // ENV_CHECK,
  // NODE_ENV,
  // dev,
  // unitTest,
  // e2eTest,
  // useHttps,
  // HOST,
  // PORT_API_HTTP,
  // PORT_API_HTTPS,
  // SESSION_OPTIONS,
});
