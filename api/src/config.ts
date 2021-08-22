import fs from 'fs';
import path from 'path';

const env = process.env;
export const NODE_ENV = process.env.NODE_ENV;
export const dev = NODE_ENV === 'development';
export const unitTest = env.TEST_ENV === 'unit'; // no SSL
export const e2eTest = env.TEST_ENV === 'e2e'; // no SSL (SSL through docker)

export const useHttps = unitTest ? false : env.USE_HTTPS === 'true';

// just to check .env file loads
export const ENV_CHECK = env.ENV_CHECK;

export const HOST = env.HOST;

const SSLKeyPath = path.join(__dirname, '../../deploy/certs/key.pem');
const SSLCertPath = path.join(__dirname, '../../deploy/certs/cert.pem');

export const SSL_KEY = useHttps ? fs.readFileSync(SSLKeyPath) : null;

export const SSL_CERT = useHttps ? fs.readFileSync(SSLCertPath) : null;

export const PORT_API_HTTP = Number(env.PORT_API_HTTP);
export const PORT_API_HTTPS = Number(env.PORT_API_HTTPS);

console.log({
  ENV_CHECK,
  NODE_ENV,
  dev,
  unitTest,
  e2eTest,
  useHttps,
  HOST,
  PORT_API_HTTP,
  PORT_API_HTTPS,
});
