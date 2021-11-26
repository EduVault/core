import express from 'express';
import { AppPerson } from 'types';
import { respondError } from './api';

export * from './encryption';
export * from './jwt';
export * from './api';
export * from './errors';
export * from './formatPasswordSignIn';

export const sessionLogin = ({
  req,
  res,
  done,
  appPerson,
}: {
  req: express.Request;
  appPerson: AppPerson;
  res: express.Response;
  done?: () => any;
}) => {
  const loginCallback = (error: string) => {
    if (error) {
      console.log('req.login error', { error });
      return respondError(res, 'passportError', error);
    }
  };
  if (!appPerson) console.log('attempting login, appPerson is undefined');
  req.login(appPerson, done ?? loginCallback);
};
