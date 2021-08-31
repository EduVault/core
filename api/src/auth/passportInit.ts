import { Express } from 'express';
import { Database } from '@textile/threaddb';
import session from 'cookie-session';
import passport from 'passport';

import { IPerson } from '../models/person';
import { IApp } from '../models/app';
import { SESSION_OPTIONS } from '../config';
import { findAppByID, findPersonByID } from '../db';

import passwordStrat from './strategies/password';
// import devStrat from './strategies/dev';
// import googleStrat from './strategies/google';
// import facebookStrat from './strategies/facebook';
// import dotwalletStrat from './strategies/dotwallet';
// import appStrat from './strategies/app';

export default (app: Express, db: Database) => {
  app.use(session(SESSION_OPTIONS as any)); // This library's shitty typescript declaration file does not export types properly. Luckily we have type safety in the config.js file when we create these options

  passport.serializeUser(function (personOrApp: IPerson | IApp, done) {
    if (!personOrApp) done(personOrApp, null);
    // console.log('serializing: ', { personOrApp });
    done(null, personOrApp._id);
  });

  passport.deserializeUser(async function (id, done) {
    if (typeof id !== 'string') {
      done('error deserializing, id not string: ' + JSON.stringify(id), null);
      return;
    }
    const app = findAppByID(db, id);
    if (app) done(null, app);
    else {
      const person = findPersonByID(db, id);
      if (person) done(null, person);
      else done(person, null);
    }
  });

  /** Our strategies here: */
  passport.use('password', passwordStrat(db));
  // passport.use('dev', devStrat(db));
  // passport.use(googleStrat(db));
  // passport.use(facebookStrat(db));
  // passport.use('dotwallet', dotwalletStrat, db);
  // passport.use('app', appStrat(db));

  /** Init boilerplate */
  app.use(passport.initialize());
  app.use(passport.session());
  return passport;
};
