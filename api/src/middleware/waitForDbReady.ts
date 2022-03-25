import { Database } from '@textile/threaddb';
import { Request, Response, NextFunction } from 'express';

import { dbReady } from '../db';

export const waitForDbReady =
  (db: Database) => async (req: Request, res: Response, next: NextFunction) => {
    if (req.app.locals.dbReady === true) {
      // console.log('dbReady');
      return next();
    } else {
      const maxTries = 10;
      const tryInterval = 250; //ms
      const check: any = async (tries = 0) => {
        if (tries > maxTries) return 'exceeded max tries';
        const ready = await dbReady(db);
        console.log({ ready, tries });
        if (ready) return 'ready';
        else
          return await new Promise((resolve) =>
            setTimeout(async () => resolve(await check(tries + 1)), tryInterval)
          );
      };
      if ((await check()) === 'ready') {
        req.app.locals.dbReady = true;
        return next();
      }
    }
  };
