import { Client } from '@textile/hub';
import {
  ADMIN_USERNAME,
  APP_SECRET,
  HOST,
  prod,
  TEXTILE_USER_API_KEY,
  TEXTILE_USER_API_SECRET,
} from '../config';
import { CollectionConfig } from '@textile/threaddb/dist/cjs/local/collection';
import { Database, PrivateKey, ThreadID } from '@textile/threaddb';
import { ulid } from 'ulid';

import { appSchema, personSchema } from '../models';
import { IApp, IPerson } from '../types';
import { encrypt, hash, hashPassword } from '../helpers';
import { appID, password, personID, username } from '../helpers/testUtil';
import { findAppByID, findPersonByID, saveApp, savePerson } from './methods';
import { findPersonByUsername } from '../db';

// textile bug, not accepting this as an array so add using db.collectionConfig()
const collectionConfigs: CollectionConfig[] = [
  { name: 'app', schema: appSchema },
  { name: 'person', schema: personSchema },
];

export const newLocalDB = (dbName = 'eduvault-api') => {
  try {
    // const db = await new Database(dbName, ...collectionConfigs); // TODO: try this later
    const db = new Database(dbName);
    collectionConfigs.forEach(async (config) => db.collectionConfig(config));

    // console.log('started local db', { db });
    // const collections = await db.collections();
    // console.log({ collections: collections.keys() });

    return db;
  } catch (error) {
    console.log({ error });
    return null;
  }
};

export const newClientDB = async () => {
  const keyInfo = {
    key: TEXTILE_USER_API_KEY,
    secret: TEXTILE_USER_API_SECRET,
  };
  // console.log({ keyInfo });
  const db = await Client.withKeyInfo(keyInfo);
  return db;
};

export const clearCollections = async (db: Database) => {
  try {
    const personCollection = db.collection<IPerson>('person');
    // const personsBefore = await personCollect.find({});
    // console.log({ personsBefore: personsBefore.toArray() });
    await personCollection.clear();
    // const personsAfter = await personCollect.find({});
    // console.log({ personsAfter: personsAfter.toArray() });
    const constAppCollection = db.collection<IApp>('app');
    // const appsBefore = await constAppCollect.find({});
    // console.log({ appsBefore });
    await constAppCollection.clear();
    // const appsAfter = await constAppCollect.find({});
    // console.log({ appsBefore });
  } catch (error) {
    console.log({ error });
  }
};

/** formats a new person. Creates new keys and thread id */
export const formatNewPerson = async (options: {
  username?: string;
  password?: string;
  appID?: string;
}): Promise<IPerson> => {
  const privateKey = await PrivateKey.fromRandom();
  const pubKey = await privateKey.public.toString();
  const newThreadID = await ThreadID.fromRandom();
  const threadIDStr = newThreadID.toString();
  const hashed = hash(options.password);
  // console.log({ hashed, doubleHashed: hashPassword(hashed) });
  const person = {
    _id: personID,
    username: options.username,
    password: hashPassword(hashed),
    pwEncryptedPrivateKey: encrypt(privateKey.toString(), options.password),
    threadIDStr,
    pubKey,
    dev: options.appID
      ? { isVerified: true, apps: [options.appID] }
      : undefined,
  };

  return person;
};

export const formatNewApp = ({
  devID,
  appID,
  description,
  name,
  authorizedDomains,
}: {
  devID: string;
  appID?: string;
  description?: string;
  name: string;
  authorizedDomains: string[];
}) => {
  const app: IApp = {
    _id: appID ?? ulid(),
    devID,
    description,
    name,
    authorizedDomains,
  };
  return app;
};

/**
 * if production, load or create th
 */
export const populateDB = async (db: Database) => {
  if (prod) {
    const createAdmin = async () =>
      await formatNewPerson({
        username: ADMIN_USERNAME,
        password: APP_SECRET,
        appID: appID,
      });
    let admin: IPerson;
    try {
      admin = await findPersonByUsername(db, ADMIN_USERNAME);
    } catch (error) {
      admin = await createAdmin();
      await savePerson(db, admin);
    }
    if (!admin) {
      admin = await createAdmin();
      await savePerson(db, admin);
    }

    let officialApp = await findAppByID(db, appID);
    if (!officialApp) {
      officialApp = formatNewApp({
        appID, // '1'
        devID: admin._id,
        name: 'EduVault Home',
        description: 'Your personal education database',
        authorizedDomains: [`${HOST}`],
      });
    }
    console.log({ officialApp, admin });
    await saveApp(db, officialApp);
  } else {
    const newPerson = await formatNewPerson({ username, password, appID });
    await savePerson(db, newPerson);
    const newApp = formatNewApp({
      appID,
      devID: newPerson._id,
      name: 'testing app',
      description: 'an app for testing',
      authorizedDomains: [
        'localhost',
        '127.0.0.1',
        'localhost:8082',
        'localhost:8081',
        'localhost:3000',
      ],
    });
    await saveApp(db, newApp);
  }
};

export const dbReady = async (db: Database) => {
  const defaultApp = await findAppByID(db, appID);
  let defaultPerson: IPerson;
  if (prod) defaultPerson = await findPersonByUsername(db, ADMIN_USERNAME);
  else defaultPerson = await findPersonByID(db, personID);
  console.log({ defaultPerson, defaultApp });
  if (defaultApp && defaultApp._id && defaultPerson && defaultPerson._id)
    return true;
  return false;
};
