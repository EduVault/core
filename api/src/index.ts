import express from 'express';
import cors from 'cors';
import path from 'path';
import https from 'https';
import {
  PORT_API,
  DOTENV_TEST,
  dev,
  unitTest,
  SSL_KEY,
  SSL_CERT,
} from './config';
import router from './routes';
const app = express();

app.use(cors());

// Check dotenv Loads
app.get('/dotenv-check', (req, res) => {
  res.json({ PORT_API, DOTENV_TEST });
});

// Serve API
app.use('/api', router);

// Serve App
const appPath = path.join(__dirname, '../../app/build');

if (!dev && !unitTest) app.use(express.static(appPath));
app.get('/app', (req, res) => {
  if (dev || unitTest) res.redirect('http://localhost:3000');
  else res.sendFile(appPath + 'index.html');
});

const onStart = () =>
  console.log('app listening at http://localhost:' + PORT_API);

const startServer = () => {
  const server = https.createServer({ key: SSL_KEY, cert: SSL_CERT }, app);
  server.listen(PORT_API, onStart);
  return server;
};
if (!unitTest) startServer();
export { app, startServer };
