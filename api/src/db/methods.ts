import { Database } from '@textile/threaddb';
import { IPerson } from '../models/person';
import { IApp } from '../types';

export const findAppByID = async (db: Database, id: string) =>
  (await db.collection<IApp>('app').findById(id)) as IApp;

export const findPersonByID = async (db: Database, id: string) =>
  (await db.collection<IPerson>('person').findById(id)) as IPerson;

export const findPersonByUsername = async (db: Database, username: string) =>
  (await db.collection<IPerson>('person').findOne({ username })) as IPerson;

export const savePerson = async (db: Database, person: IPerson) =>
  await db.collection<IPerson>('person').save(person);

export const saveApp = async (db: Database, app: IApp) =>
  await db.collection<IApp>('app').save(app);

export const findAllAppsWithAuthorizedDomains = async (db: Database) =>
  await db
    .collection<IApp>('app')
    .find({ authorizedDomains: { $exists: true } });

export const findAuthorizedDomain = async (db: Database, domain: string) =>
  await db
    .collection<IApp>('app')
    .findOne({ authorizedDomains: { $elemMatch: { $eq: domain } } });
