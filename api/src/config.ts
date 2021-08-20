import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const env = process.env;

export const dev = env.NODE_ENV === 'development'; // SSL
export const unitTest = env.NODE_ENV === 'test'; // no SSL
export const CITest = env.NODE_ENV === 'e2e'; // no SSL (SSL through docker)
export const prod = env.NODE_ENV === 'production'; // no SSL (SSL through docker)

// just to check .env file loads
export const ENV_CHECK = env.ENV_CHECK;

const PROD_HOST = env.PROD_HOST;
export const HOST = dev || unitTest ? 'localhost' : PROD_HOST;

const devSSLKeyPath = path.join(__dirname, '../../deploy/dev-certs/key.pem');
const devSSLCertPath = path.join(__dirname, '../../deploy/dev-certs/cert.pem');

export const SSL_KEY = dev ? fs.readFileSync(devSSLKeyPath) : null;

export const SSL_CERT = dev ? fs.readFileSync(devSSLCertPath) : null;

export const PORT_HTTP = Number(env.PORT_HTTP) || 5001;
export const PORT_HTTPS = Number(env.PORT_HTTPS) || 5002;

console.log({
  ENV_CHECK,
  NODE_ENV: env.NODE_ENV,
  dev,
  prod,
  unitTest,
  CITest,
  HOST,
  PORT_HTTP,
  PORT_HTTPS,
});
