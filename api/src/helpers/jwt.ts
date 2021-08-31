import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { APP_SECRET, JWT_EXPIRY } from '../config';
// import { IPerson } from '../models/person';
// import { IApp } from '../models/app';
import { AppTokenData } from '../types';
import { IPerson } from '../models';

export const createJwt = (id: string) => {
  const newJwt = jwt.sign({ data: { id } }, APP_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
  // console.log({ newJwt });
  return newJwt;
};

export const createCustomJwt = (data: any) => {
  const newJwt = jwt.sign({ data }, APP_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
  // console.log({ newJwt });
  return newJwt;
};

export const getJwtExpiry = async (token: string) => {
  try {
    const decoded: any = jwt.verify(token, APP_SECRET);
    // console.log({ decoded });
    return new Date(decoded.exp * 1000);
  } catch (err) {
    console.log('err', err);
    return false;
  }
};

export const validateAndDecodeJwt = async (token: string) => {
  try {
    const decoded: any = jwt.verify(token, APP_SECRET);
    const exp = new Date(decoded.exp * 1000);
    const now = new Date();
    const valid = now < exp;
    if (valid) {
      return decoded;
    } else {
      return false;
    }
  } catch (err) {
    console.log('err', err);
    return false;
  }
};
export async function createAppLoginToken(appID: string, decryptToken: string) {
  const createdAt = new Date().getTime();
  return createCustomJwt({ id: appID, decryptToken });
}

export async function compareAppLoginToken(
  token: string,
  appID: string
): Promise<string | AppTokenData> {
  const decoded = await validateAndDecodeJwt(token);
  // console.log({ decoded, appID });
  if (!decoded.data) return 'token could not be decoded';
  const now = new Date().getTime();
  // code valid for 2 minutes 1000 * 60 * 2
  // while testing, setting to 2 days
  const expiryDuration = 1000 * 60 * 60 * 24 * 2;
  // iat is in seconds
  const difference = now - decoded.iat * 1000;
  const hasNotExpired = difference < expiryDuration;
  // console.log({ expiryDuration, hasNotExpired, difference });

  if (!hasNotExpired)
    return `token issued ${difference} ms ago. longest valid time is: ${expiryDuration}`;
  const IDMatches = decoded.data.id === appID;
  if (IDMatches) return decoded;
  else return 'token ID does not match';
}

export const refreshJwts = async (req: Request, person: IPerson) => {
  if (req.session.jwt) {
    const now = new Date().getTime();
    const expiry = await getJwtExpiry(req.session.jwt);
    if (!expiry) req.session.jwt = createJwt(person.username);
    else if (now - expiry.getTime() < 1000 * 60 * 60 * 24) {
      req.session.oldJwt = JSON.parse(JSON.stringify(req.session.jwt));
      req.session.jwt = createJwt(person.username);
    }
  } else req.session.jwt = createJwt(person.username);
};
