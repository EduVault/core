import express, { Express } from 'express';
import path from 'path';
import https from 'https';
// import http from 'http';

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
  ROUTES,
} from './config';
import routerInit from './routes';
import passportInit from './auth/passportInit';
import { newLocalDB, populateDB } from './db';
import { cors, waitForDbReady } from './middleware';
import { startWss } from './routes/wss';

const app = express();
app.set('trust proxy', useHttps ? 0 : 1); //trust one hop away in http (docker) mode
app.use(express.json());

// Check environment variables load
app.get(ROUTES.api.ENV_CHECK, (req, res) => {
  res.json({ ENV_CHECK });
});

const serveFrontend = (app: Express) => {
  if (dev) {
    app.get('(/*)?', (req, res) => {
      res.redirect(`https://localhost:3000${req.url}`);
    });
  } else {
    app.get('/', (req, res) => {
      res.redirect(`http://${HOST}/home`);
    });
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

  // TODO: in prod replace with persistent db that syncs with previous deployments
  const db = newLocalDB();
  await db.open(2);
  await populateDB(db);
  app.use(await cors(db));
  app.use(waitForDbReady(db));
  const passport = passportInit(app, db);
  routerInit(app, passport, db);
  serveFrontend(app);
  if (useHttps) {
    const httpRedirect = (server: Express) =>
      server.use((req, res, next) => {
        if (req.secure) {
          next();
        } else {
          res.redirect(`https://${req.hostname}:${PORT_API_HTTPS}${req.url}`);
        }
      });

    const httpServer = express();
    httpServer.listen(PORT_API_HTTP, onStart(PORT_API_HTTP));
    httpRedirect(httpServer);

    const httpsServer = https.createServer({ key, cert }, app);
    await startWss(httpsServer, db);

    httpsServer.listen(PORT_API_HTTPS, onStart(PORT_API_HTTPS));
  } else {
    const httpServer = app.listen(PORT_API_HTTP, onStart(PORT_API_HTTP));
    await startWss(httpServer, db);
  }
};

if (!unitTest) startServer();
export { app, startServer };
