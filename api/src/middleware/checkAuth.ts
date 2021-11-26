import { Request, Response, NextFunction } from 'express';

import { respondError } from '../helpers';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log('cookies exist: ', !!req.headers.cookie);
  const user: any = req.user;
  try {
    console.log('req.user.person.username: ', user.person.username);
  } catch (err) {
    console.log('req.user.person.username: ', 'no user');
  }
  if (!req.isAuthenticated()) {
    console.log('authenticationFailed');
    respondError(res, 'authenticationFailed');
  } else {
    console.log('authenticated');
    return next();
  }
};
