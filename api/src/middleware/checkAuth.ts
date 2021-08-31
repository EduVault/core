import { Request, Response, NextFunction } from 'express';

import { respondError } from '../helpers';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    respondError(res, 'authenticationFailed');
  } else {
    return next();
  }
};
