import { Router, Request, Response } from 'express';
import passport from 'passport';
import { IPerson } from '../models/person';
// import { IApp } from '../models/app';
import { ROUTES } from '../config';
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

const password = (
  router: Router,
  passport: passport.PassportStatic,
  db: Database
) => {
  const signup = async (
    req: Request,
    res: Response,
    appLoginToken?: string,
    decryptToken?: string
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

  router.post(ROUTES.PASSWORD_AUTH, async (req, res, next) => {
    const data = req.body as PasswordLoginReq;
    // console.log({ data });
    if (!data) return respondError(res, 'missingPasswordRequestData');
    if (!data.password || !data.username)
      return respondError(res, 'missingPasswordOrUsername');

    const appLoginTokens = async () => {
      if (data.redirectURL && data.appID) {
        const decryptToken = uuid();
        return {
          decryptToken,
          appLoginToken: await createAppLoginToken(data.appID, decryptToken),
        };
      } else return { decryptToken: null, appLoginToken: null };
    };

    const { appLoginToken, decryptToken } = await appLoginTokens();
    // console.log({ appLoginToken, decryptToken });
    const person = await findPersonByUsername(db, data.username);
    // console.log({ person });

    if (!person) return signup(req, res, appLoginToken, decryptToken);

    const loginAuthCallback = async (error: string, foundPerson: IPerson) => {
      // strange bug where passport is returning false for the user, but accepting authentication. console logs aren't working within the strategy either
      console.log({ error, foundPerson });
      // so do another check here:
      // const valid = validPassword(data.password, person.password);
      // console.log('password check: ', { valid });
      //   if (error || !valid) {
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
    return passport.authenticate('password', loginAuthCallback);
  });
};
export default password;
