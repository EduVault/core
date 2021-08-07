import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const env = process.env;
export const DOTENV_TEST = env.DOTENV_TEST;
export const dev = env.NODE_ENV === 'development';
export const unitTest = env.NODE_ENV === 'test';
const PROD_HOST = env.PROD_HOST;
export const HOST = dev ? 'localhost' : PROD_HOST;

const devSSLKeyPath = path.join(
  __dirname,
  '../../deploy/dev-certs/localhost-key.pem'
);
const devSSLCertPath = path.join(
  __dirname,
  '../../deploy/dev-certs/localhost.pem'
);
const prodSSLKeyPath = path.join(
  __dirname,
  `../../deploy/prod-certs/localhost-key.pem`
);
const prodSSLCertPath = path.join(
  __dirname,
  `../../deploy/prod-certs/localhost.pem`
);
export const SSL_KEY = unitTest
  ? null
  : fs.readFileSync(dev ? devSSLKeyPath : prodSSLKeyPath);

export const SSL_CERT = unitTest
  ? null
  : fs.readFileSync(dev ? devSSLCertPath : prodSSLCertPath);

// export const PORT_API = Number(env.PORT_API) || 5555;

console.log({
  // port: env.PORT_API,
  NODE_ENV: env.NODE_ENV,
  dev,
  // PORT_API,
  unitTest,
  DOTENV_TEST,
  PROD_HOST,
});
