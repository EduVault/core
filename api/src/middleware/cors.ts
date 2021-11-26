import { Database } from '@textile/threaddb';
import { Request, Response, NextFunction } from 'express';

import { HOST, prod } from '../config';
import { respondError } from '../helpers';
import { findAllAppsWithAuthorizedDomains } from '../db';

export * from './checkAuth';

/**
 * allows external apps to make some basic requests. requests with credentials must be from a registered apps' domain.
 */
export const cors = async (db: Database) => {
  let validDomains: string[] = [];
  const apps = await findAllAppsWithAuthorizedDomains(db);
  await apps.each((app) =>
    app.authorizedDomains.forEach((domain) => validDomains.push(domain))
  );
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log({ validDomains });
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': '2592000', // 30 days,
        'Access-Control-Allow-Credentials': 'false',
        'Access-Control-Allow-Headers':
          'Content-Type, x-requested-with, x-forwarded-proto',
      };

      const origin = req.headers.origin;
      const inValid = validDomains.indexOf(origin) === -1;
      console.log({ validDomains, origin, inValid });
      if (!inValid) {
        headers['Access-Control-Allow-Origin'] = origin;
        headers['Access-Control-Allow-Credentials'] = 'true';
      }

      console.log({ headers, method: req.method });
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
