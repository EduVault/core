import { Router, Request, Response } from 'express';
import passport from 'passport';
import { API_ROUTES, dev, e2eTest, HOST, prod, unitTest } from '../config';
import {
  hashPassword,
  createAppJwt,
  createLoginToken,
  refreshJwts,
  validPassword,
} from '../helpers';
import { ulid } from 'ulid';
import { Database } from '@textile/threaddb';

import { IPerson } from '../models/person';
import { PasswordLoginReq, PasswordLoginRes } from '../types';
import { respond, respondError } from '../helpers/api';
import { findPersonByUsername, savePerson } from '../db';
import { restrictToOfficialApp } from '../middleware';

const signup = async (
  req: Request,
  res: Response,
  db: Database,
  appID: string
) => {
  const { pwEncryptedPrivateKey, pubKey, threadIDStr, username, password } =
    req.body as PasswordLoginReq;

  if (!pwEncryptedPrivateKey || !pubKey || !threadIDStr)
    return respondError(res, 'signupMissingKeys');
  const signupResponse = respond<PasswordLoginRes>(res);

  const newPerson: IPerson = {
    _id: ulid(),
    password: hashPassword(password),
    username,
    pwEncryptedPrivateKey,
    pubKey,
    threadIDStr,
    dev: { isVerified: false, apps: [] },
  };
  console.log({ newPerson });

  await savePerson(db, newPerson);

  req.session.jwt = createAppJwt({ personID: newPerson._id, appID });
  const loginToken = await createLoginToken({ appID, personID: newPerson._id });
  const returnData: PasswordLoginRes = {
    pwEncryptedPrivateKey,
    pubKey,
    threadIDStr,
    jwt: req.session.jwt,
    loginToken,
  };

  return signupResponse(returnData);
};

const login = async ({
  req,
  res,
  loginToken,
  person,
  password,
  appID,
}: {
  req: Request;
  res: Response;
  person: IPerson;
  loginToken: string;
  password: string;
  appID: string;
}) => {
  // manually test password
  const valid = validPassword(password, person.password);
  console.log('password check: ', valid);
  if (!valid) respondError(res, 'incorrectPassword');

  await refreshJwts(req, { personID: person._id, appID });

  const returnData: PasswordLoginRes = {
    pwEncryptedPrivateKey: person.pwEncryptedPrivateKey,
    jwt: req.session.jwt,
    pubKey: person.pubKey,
    threadIDStr: person.threadIDStr,
    loginToken,
  };
  // console.log({ returnData });

  respond(res)(returnData);
};

/**
 * Restricted to official app (http://eduvault.org)
 */
const password = (router: Router, db: Database) => {
  // TODO: deny if request not sent from app url (test it)
  router.post(
    API_ROUTES.PASSWORD_AUTH,
    restrictToOfficialApp,
    async (req, res) => {
      const data = req.body as PasswordLoginReq;
      // console.log({ data });
      if (!data) return respondError(res, 'missingPasswordRequestData');
      const { username, appID, password } = data;
      if (!password || !username)
        return respondError(res, 'missingPasswordOrUsername');

      const person = await findPersonByUsername(db, username);
      // console.log({ person });
      if (!person) return signup(req, res, db, appID);

      const loginToken = await createLoginToken({
        appID,
        personID: person._id,
      });
      return login({ req, res, person, loginToken, password, appID });
    }
  );
};
export default password;
