import { Database } from '@textile/threaddb';
import { IPerson } from 'models/person';
export const findAppByID = async (db: Database, id: string) =>
  await db.collection('app').findById(id);

export const findPersonByID = async (db: Database, id: string) =>
  await db.collection('person').findById(id);

export const findPersonByUsername = async (db: Database, username: string) =>
  await db.collection<IPerson>('person').findOne({ username });

export const saveNewPerson = async (db: Database, person: IPerson) =>
  await db.collection<IPerson>('person').save(person);
