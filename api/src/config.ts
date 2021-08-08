import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const env = process.env;

export const dev = env.NODE_ENV === 'development';
export const unitTest = env.NODE_ENV === 'test';
export const CITest = env.NODE_ENV === 'e2e';

// just to check .env file loads
export const ENV_TEST = env.ENV_TEST;

const PROD_HOST = env.PROD_HOST;
export const HOST = dev ? 'localhost' : PROD_HOST;

const devSSLKeyPath = path.join(__dirname, '../../deploy/dev-certs/key.pem');
const devSSLCertPath = path.join(__dirname, '../../deploy/dev-certs/cert.pem');
const prodSSLKeyPath = path.join(__dirname, `../../deploy/prod-certs/key.pem`);
const prodSSLCertPath = path.join(
  __dirname,
  `../../deploy/prod-certs/cert.pem`
);
export const SSL_KEY = unitTest
  ? null
  : fs.readFileSync(dev ? devSSLKeyPath : prodSSLKeyPath);

export const SSL_CERT = unitTest
  ? null
  : fs.readFileSync(dev ? devSSLCertPath : prodSSLCertPath);

export const PORT_HTTP_DEV = Number(env.PORT_HTTP_DEV) || 5555;
export const PORT_HTTPS_DEV = Number(env.PORT_HTTPS_DEV) || 6666;
export const PORT_HTTP_PROD = 80;
export const PORT_HTTPS_PROD = 443;

console.log({
  // port: env.PORT_API,
  NODE_ENV: env.NODE_ENV,
  dev,
  unitTest,
  ENV_TEST,
  PROD_HOST,
  PORT_HTTP_DEV,
  PORT_HTTPS_DEV,
  CITest,
});
