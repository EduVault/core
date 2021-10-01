import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { APP_SECRET, JWT_EXPIRY } from '../config';

import { JWTToken, LoginToken } from '../types';

export const createJwtWithData = (
  data: any,
  expiry?: jwt.SignOptions['expiresIn']
) => {
  const newJwt = jwt.sign({ data }, APP_SECRET, {
    expiresIn: expiry ?? JWT_EXPIRY,
  });
  // console.log({ newJwt });
  return newJwt;
};

/** Login token valid for 3 minutes */
export const createLoginToken = (data: LoginToken['data']) =>
  createJwtWithData(data, '3m');

export const createAppJwt = (data: JWTToken['data']) =>
  createJwtWithData(data, '2w');

export const getJwtExpiry = (token: string) => {
  try {
    const decoded: any = jwt.verify(token, APP_SECRET);
    // console.log({ decoded });
    return { expiry: new Date(decoded.exp * 1000) };
  } catch (error) {
    console.log('getJwtExpiry err', error);
    return { error };
  }
};

export const validateAndDecodeJwt = async <T>(token: string) => {
  try {
    const decoded = jwt.verify(token, APP_SECRET) as T;
    const { error, expiry } = getJwtExpiry(token);
    if (error) throw error;
    const now = new Date();
    const valid = now < expiry;
    if (valid) {
      return { decoded };
    } else {
      throw 'invalid. now: ' + now + 'expiry: ' + expiry;
    }
  } catch (error) {
    // console.log('validateAndDecodeJwt error', error);
    return { error };
  }
};

export const refreshJwts = async (
  req: Request,
  { appID, personID }: { appID: string; personID: string }
) => {
  if (req.session.jwt) {
    // if within a day of the expiry, refresh and store current in oldJwt.
    /// helps app
    const now = new Date().getTime();
    const { error, expiry } = getJwtExpiry(req.session.jwt);
    if (error) throw error;
    // if within a day
    const refreshWindow = 1000 * 60 * 60 * 24;
    if (!expiry) req.session.jwt = createAppJwt({ appID, personID });
    else if (now - expiry.getTime() < refreshWindow) {
      // TODO: test this behavior
      // console.log('refreshing jwts');
      const oldJwt = JSON.parse(JSON.stringify(req.session.jwt));
      req.session.oldJwt = oldJwt;

      req.session.jwt = createAppJwt({ appID, personID });
    }
  } else req.session.jwt = createAppJwt({ appID, personID });
};
