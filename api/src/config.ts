import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const env = process.env;

export const DOTENV_TEST = env.DOTENV_TEST;
export const SSL_KEY = fs.readFileSync(path.join(__dirname, '../../key.pem')); // https://medium.com/@nitinpatel_20236/how-to-create-an-https-server-on-localhost-using-express-366435d61f28

export const SSL_CERT = fs.readFileSync(path.join(__dirname, '../../cert.pem'));
export const dev = env.NODE_ENV === 'development';
export const unitTest = env.NODE_ENV === 'test';
export const PORT_API = Number(env.PORT_API) || 5555;

console.log({
  port: env.PORT_API,
  NODE_ENV: env.NODE_ENV,
  dev,
  PORT_API,
  unitTest,
  DOTENV_TEST,
});
