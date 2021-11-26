import { Express } from 'express';
import { Database } from '@textile/threaddb';
import session from 'cookie-session';
import passport from 'passport';

import { SESSION_OPTIONS } from '../config';
import { findAppByID, findPersonByID } from '../db';

// import passwordStrat from './strategies/password';
// import devStrat from './strategies/dev';
// import googleStrat from './strategies/google';
// import facebookStrat from './strategies/facebook';
// import dotwalletStrat from './strategies/dotwallet';
import appStrat from './strategies/appAuth';
import { AppPerson } from '../types';

export default (app: Express, db: Database) => {
  app.use(session(SESSION_OPTIONS as any)); // This library's shitty typescript declaration file does not export types properly. Luckily we have type safety in the config.js file when we create these options

  const IDSplitTerm = '__***__';
  // a session must have both an app and a person
  passport.serializeUser((appPerson: AppPerson, done) => {
    if (!appPerson) done(appPerson, null);
    console.log('serializing: ', { appPerson });
    done(null, appPerson.person._id + IDSplitTerm + appPerson.app._id);
  });

  passport.deserializeUser(
    async (id, done: (err: any, user?: false | AppPerson) => void) => {
      if (typeof id !== 'string') {
        done('error deserializing, id not string: ' + JSON.stringify(id));
        return;
      }
      const splitID = id.split(IDSplitTerm);
      const personID = splitID[0];
      const appID = splitID[1];
      // console.log({ appID, personID });
      const app = await findAppByID(db, appID);
      // console.log({ app });
      if (!app) done(app);
      else {
        const person = await findPersonByID(db, personID);
        console.log('deserializing');
        console.log({ person });
        if (!person) done(person);
        else done(null, { person, app });
      }
    }
  );

  /** Our strategies here: */
  // passport.use('password', passwordStrat(db));
  // passport.use('dev', devStrat(db));
  // passport.use(googleStrat(db));
  // passport.use(facebookStrat(db));
  // passport.use('dotwallet', dotwalletStrat, db);
  passport.use('app-auth', appStrat(db));

  /** Init boilerplate */
  app.use(passport.initialize());
  app.use(passport.session());
  return passport;
};
