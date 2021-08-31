import express, { Express } from 'express';
import passport from 'passport';
import cors from 'cors';
import path from 'path';
import https from 'https';
import http from 'https';
import { Database } from '@textile/threaddb';

import {
  PORT_API_HTTP,
  PORT_API_HTTPS,
  ENV_CHECK,
  dev,
  unitTest,
  useHttps,
  SSL_KEY as key,
  SSL_CERT as cert,
  HOST,
} from './config';
import routerInit from './routes';
import passportInit from './auth/passportInit';
import { newLocalDB } from './db';

const app = express();
app.set('trust-proxy', !useHttps);
app.use(cors()); //TODO: cors settings
app.use(express.json());

// Check environment variables load
app.get(ROUTES.ENV_CHECK, (req, res) => {
  res.json({ ENV_CHECK });
});

const serveFrontend = (app: express.Application) => {
  if (dev) {
    app.get(['/', '/*'], (req, res) => {
      res.redirect('http://localhost:3000');
    });
  } else {
    const buildPath = path.normalize(path.join(__dirname, '../../app/build'));
    app.use(express.static(buildPath));
    app.get('(/*)?', (req, res) =>
      res.sendFile(path.join(buildPath, 'index.html'))
    );
  }
};

const startServer = async () => {
  const onStart = (port: number) => () =>
    console.log(
      `app listening at http${
        port === PORT_API_HTTPS ? 's' : ''
      }://${HOST}:${port}`
    );

  if (unitTest) return http.createServer(app).listen();

  const db = await newLocalDB();
  const passport = passportInit(app, db);
  routerInit(app, passport, db);
  serveFrontend(app);

  if (useHttps) {
    const httpRedirect = (server: Express) =>
      server.use((req, res, next) => {
        if (req.secure) {
          next();
        } else {
          res.redirect(`https://${HOST}:${PORT_API_HTTPS}${req.url}`);
        }
      });

    const httpServer = express();
    httpServer.listen(PORT_API_HTTP, onStart(PORT_API_HTTP));
    httpRedirect(httpServer);

    const httpsServer = https.createServer({ key, cert }, app);
    httpsServer.listen(PORT_API_HTTPS, onStart(PORT_API_HTTPS));
  } else {
    app.listen(PORT_API_HTTP, onStart(PORT_API_HTTP));
  }
};

if (!unitTest) startServer();
export { app, startServer };
