import { Database } from '@textile/threaddb';
import { Request, Response, NextFunction } from 'express';

import { HOST, prod } from '../config';
import { respondError } from '../helpers';
import { findAllAppsWithAuthorizedDomains, findAuthorizedDomain } from '../db';

export * from './checkAuth';

/**
 * allows external apps to make some basic requests. requests with credentials must be from a registered apps' domain.
 */
export const cors = async (db: Database) => {
  /** preloaded verified app domains. */
  let validDomains: string[] = [];
  const apps = await findAllAppsWithAuthorizedDomains(db);
  await apps.each((app) =>
    app.authorizedDomains.forEach((domain) => validDomains.push(domain))
  );
  return (req: Request, res: Response, next: NextFunction) => {
    // don't make the Request handler itself async, otherwise other middleware will finish before this, and the headers will already be sent and this will error

    const handleRequest = async () => {
      try {
        const url = req.url;
        console.log({ url });
        // console.log({ validDomains });
        const headers = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Max-Age': '0',
          'Access-Control-Allow-Credentials': 'false',
          'Access-Control-Allow-Headers':
            'Content-Type, x-requested-with, x-forwarded-proto',
        };
        // only allow post requests from /api routes
        if (url.startsWith('/api')) {
          headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS, POST';
        }

        /**
         * @example extractOrigin('https://www.example.com/') => 'https://www.example.com'
         */
        const extractOrigin = (origin: string) => {
          if (!origin) return null;
          const originHost = origin.split('//')[1];
          const protocol = origin.split('//')[0];
          const trailingSlashRemoved = originHost.split('/')[0];
          return protocol + '//' + trailingSlashRemoved;
        };

        /**
         * @example extractOriginHost('https://www.example.com/') => 'www.example.com'
         */
        const extractOriginHost = (origin: string) => {
          if (!origin) return null;
          const originHost = origin.split('//')[1];
          const trailingSlashRemoved = originHost.split('/')[0];
          return trailingSlashRemoved;
        };

        // Then browser sometimes only sends a referer not an origin
        const originHost =
          extractOriginHost(req.headers.origin) ??
          extractOriginHost(req.headers.referer);
        const validDomain = validDomains.indexOf(originHost) !== -1;

        const origin =
          extractOrigin(req.headers.origin) ??
          extractOrigin(req.headers.referer);

        // TODO: if domain can't be found in what the database loaded at server start, check again if the app was just registered.
        // const checkNewAppDomain = async () => {
        //   findAuthorizedDomain(db, origin);
        // };
        console.log({ origin, originHost, validDomain });
        if (!validDomain) {
          headers['Access-Control-Allow-Origin'] = origin;
          headers['Access-Control-Allow-Credentials'] = 'true';
          headers['Access-Control-Max-Age'] = '2592000'; // 30 days, in seconds
        }

        // console.log({ headers, method: req.method });
        if (req.method === 'OPTIONS') {
          console.log('writing option header');
          res.writeHead(200, headers);
          return res.end();
        } else {
          console.log('writing headers');
          Object.entries(headers).forEach(([header, val]) =>
            res.header(header, val)
          );
          return next();
        }
      } catch (error) {
        console.log('cors error: ' + error);
        return next();
      }
    };
    handleRequest();
  };
};

/**
 * This will be applied to individual routes, therefore after the first cors function
 */
export const restrictToOfficialApp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!prod && req.hostname === '127.0.0.1') return next();
  // console.log({ hostName: req.hostname, HOST });
  if (req.hostname !== HOST) return respondError(res, 'onlyOfficial');
  else return next();
};
