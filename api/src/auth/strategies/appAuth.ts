import { Strategy } from 'passport-custom';
import { Database } from '@textile/threaddb';
import { Request } from 'express';

import { AppAuthReq, AppPerson, IApp, LoginToken } from '../../types';
import { refreshJwts, validateAndDecodeJwt } from '../../helpers';
import { findAppByID, findPersonByID } from '../../db';
import { prod } from '../../config';

/** provide at least either app or db */
const registeredUrlMatchesRequest = async ({
  req,
  appID,
  db,
  app,
}: {
  req: Request;
  appID: string;
  db?: Database;
  app?: IApp;
}) => {
  let _app = app;
  if (!_app && db) {
    _app = await findAppByID(db, appID);
  }
  console.log({ _app });
  if (!_app || !_app._id) throw 'app not found :' + _app;
  const search = _app.authorizedDomains.filter((domain) =>
    domain.includes(req.hostname)
  );
  console.log({ search }, _app.authorizedDomains, req.hostname);
  if (search.length > 0) return true;
  else return false;
};

export async function compareLoginToken(
  token: string,
  appID: string
): Promise<string | LoginToken> {
  try {
    const { error, decoded } = await validateAndDecodeJwt<LoginToken>(token);
    if (error) throw error;
    if (!decoded.data) return 'token could not be decoded';
    const now = new Date().getTime();

    // in production, code valid for 2 minutes 1000 * 60 * 2
    const expiryDuration = prod ? 1000 * 60 * 2 : 1000 * 60 * 60 * 24 * 2; // while testing, setting to 2 days

    const difference = now - decoded.iat * 1000; // iat is in seconds
    const expired = difference > expiryDuration;

    if (expired)
      return `token issued ${difference} ms ago. longest valid time is: ${expiryDuration}`;
    const IDMatches = decoded.data.appID === appID;
    if (IDMatches) return decoded as LoginToken;
    else return 'token ID does not match';
  } catch (error: any) {
    if (error.message) return error.message;
    else return JSON.stringify(error);
  }
}

const appStrat = (db: Database) =>
  new Strategy(async (req, done) => {
    const { loginToken, appID }: AppAuthReq = req.body;

    const app: IApp = await findAppByID(db, appID);
    if (!app) done('app not found');

    const matchesURL = await registeredUrlMatchesRequest({ req, appID, app });
    if (!matchesURL) done('unauthorized redirect URL');

    const tokenData = await compareLoginToken(loginToken, appID);
    if (typeof tokenData === 'string') {
      done(tokenData);
    } else {
      const personID = tokenData.data.personID;
      const person = await findPersonByID(db, personID);
      if (!person) done('person not found');
      await refreshJwts(req, { appID, personID });
      const appPerson: AppPerson = { app, person };
      done(null, appPerson);
    }
  });

export default appStrat;
