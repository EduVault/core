import { Router, Request, Response } from 'express';
import passport from 'passport';
import { IPerson } from '../models/person';
// import { IApp } from '../models/app';
import { API_ROUTES } from '../config';
import {
  hashPassword,
  createJwt,
  createAppLoginToken,
  refreshJwts,
} from '../helpers';
import { v4 as uuid } from 'uuid';
import { Database } from '@textile/threaddb';
import { PasswordLoginReq, PasswordLoginRes } from '../types';
import { respond, respondError } from '../helpers/api';
import { findPersonByUsername, saveNewPerson } from '../db';

const signup = async (
  req: Request,
  res: Response,
  db: Database,
  appLoginToken: string,
  decryptToken: string
) => {
  const data = req.body as PasswordLoginReq;

  if (!data.pwEncryptedPrivateKey || !data.pubKey || !data.threadIDStr)
    return respondError(res, 'signupMissingKeys');
  const signupResponse = respond<PasswordLoginRes>(res);

  const pwEncryptedPrivateKey = data.pwEncryptedPrivateKey;
  const pubKey = data.pubKey;
  const threadIDStr = data.threadIDStr;
  const username = data.username;

  const newPerson: IPerson = {
    _id: uuid(),
    password: hashPassword(data.password),
    username,
    pwEncryptedPrivateKey,
    pubKey,
    threadIDStr,
    dev: { isVerified: false, apps: [] },
  };
  // console.log({ newPerson });

  await saveNewPerson(db, newPerson);

  req.session.jwt = createJwt(newPerson.username);

  const returnData: PasswordLoginRes = {
    pwEncryptedPrivateKey,
    pubKey,
    threadIDStr,
    jwt: req.session.jwt,
    appLoginToken,
    decryptToken,
  };

  const signupAuthCallback = (error: string) => {
    if (error) {
      console.log({ error });
      return respondError(res, 'passportError', error);
    }
    return signupResponse(returnData);
  };
  req.logIn(newPerson, signupAuthCallback);
};

const login =
  (
    req: Request,
    res: Response,
    person: IPerson,
    appLoginToken: string,
    decryptToken: string
  ) =>
  async (error: string, foundPerson: IPerson) => {
    console.log({ error, foundPerson });
    if (error) return respondError(res, 'passportError', error);

    await refreshJwts(req, person);

    const returnData: PasswordLoginRes = {
      pwEncryptedPrivateKey: person.pwEncryptedPrivateKey,
      jwt: req.session.jwt,
      pubKey: person.pubKey,
      threadIDStr: person.threadIDStr,
      appLoginToken: appLoginToken,
      decryptToken: decryptToken,
    };
    console.log({ returnData });

    respond(res)(returnData);
  };

const password = (
  router: Router,
  passport: passport.PassportStatic,
  db: Database
) => {
  router.post(API_ROUTES.PASSWORD_AUTH, async (req, res, next) => {
    const data = req.body as PasswordLoginReq;
    console.log({ data });
    if (!data) return respondError(res, 'missingPasswordRequestData');
    if (!data.password || !data.username)
      return respondError(res, 'missingPasswordOrUsername');
    const decryptToken = uuid();
    const appLoginToken = await createAppLoginToken(data.appID, decryptToken);
    // console.log({ appLoginToken, decryptToken });
    const person = await findPersonByUsername(db, data.username);
    // console.log({ person });

    if (!person) return signup(req, res, db, appLoginToken, decryptToken);

    return passport.authenticate(
      'password',
      login(req, res, person, appLoginToken, decryptToken)
    );
  });
};
export default password;
