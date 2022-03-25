import { Database } from '@textile/threaddb';
import * as passportLocal from 'passport-local';
import { validPassword } from '../../helpers';
import { findPersonByUsername } from '../../db';

const LocalStrategy = passportLocal.Strategy;

const passwordStrat = (db: Database) =>
  new LocalStrategy(async (username: string, password: string, done) => {
    try {
      const person = await findPersonByUsername(db, username);
      if (!person) {
        done('Person not found', null);
      } else {
        if (validPassword(password, person.password)) done(null, person);
        else done('password does not match');
      }
    } catch (error) {
      done(error, null);
    }
  });
export default passwordStrat;
