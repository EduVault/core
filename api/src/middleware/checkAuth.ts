import { Request, Response, NextFunction } from 'express';

import { respondError } from '../helpers';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log('cookies exist: ', !!req.headers.cookie);
  const user: any = req.user;
  console.log('req.user.person.username: ', user.person.username);
  if (!req.isAuthenticated()) {
    console.log('authenticationFailed');
    respondError(res, 'authenticationFailed');
  } else {
    console.log('authenticated');
    return next();
  }
};
