import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import https from 'https';
import http from 'https';

import {
  PORT_HTTP_DEV,
  PORT_HTTPS_DEV,
  CITest,
  ENV_TEST,
  dev,
  unitTest,
  SSL_KEY,
  SSL_CERT,
  PORT_HTTPS_PROD,
  PORT_HTTP_PROD,
} from './config';
import router from './routes';
const app = express();

app.use(cors());

// Check dotenv Loads
app.get('/dotenv-check', (req, res) => {
  res.json({ ENV_TEST });
});

// Serve API
app.use('/api', router);

// Serve App
const appPath = path.join(__dirname, '../../app/build');

if (!dev && !unitTest) app.use(express.static(appPath));
``;
app.get('/app', (req, res) => {
  if (dev || unitTest) res.redirect('http://localhost:3000');
  else res.sendFile(appPath + '/index.html');
});

const httpRedirect = (server: Express) =>
  server.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });

const onStart = () => console.log('app listening at http://localhost');

const startServer = () => {
  const httpServer = express();
  let server: https.Server | http.Server;
  if (unitTest) {
    server = http.createServer(app).listen(80);
  } else if (CITest || dev) {
    httpRedirect(httpServer);

    httpRedirect(httpServer);
    httpServer.listen(PORT_HTTP_DEV);
    server = https.createServer({ key: SSL_KEY, cert: SSL_CERT }, app);
    server.listen(PORT_HTTPS_DEV);
  } else {
    // production
    httpRedirect(httpServer);
    httpServer.listen(PORT_HTTP_PROD);
    server = https.createServer({ key: SSL_KEY, cert: SSL_CERT }, app);
    server.listen(PORT_HTTPS_PROD);
  }

  return server;
};
if (!unitTest) startServer();
export { app, startServer };
