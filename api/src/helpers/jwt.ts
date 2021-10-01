import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { APP_SECRET, JWT_EXPIRY } from '../config';
// import { IPerson } from '../models/person';
// import { IApp } from '../models/app';
import { LoginToken } from '../types';
import { IPerson } from '../types';

export const createJwt = (id: string) => {
  const newJwt = jwt.sign({ data: { id } }, APP_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
  // console.log({ newJwt });
  return newJwt;
};

export const createCustomJwt = (
  data: any,
  expiry?: jwt.SignOptions['expiresIn']
) => {
  const newJwt = jwt.sign({ data }, APP_SECRET, {
    expiresIn: expiry ?? JWT_EXPIRY,
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

/** Login token valid for 3 minutes */
export const createLoginToken = (data: LoginToken['data']) =>
  createCustomJwt(data, '3m');

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
