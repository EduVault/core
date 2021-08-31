import { Client } from '@textile/hub';
import { TEXTILE_USER_API_KEY, TEXTILE_USER_API_SECRET } from '../config';
import { CollectionConfig } from '@textile/threaddb/dist/cjs/local/collection';
import { Database } from '@textile/threaddb';

import { appSchema, IApp, personSchema, IPerson } from '../models/';

// textile bug, not accepting this as an array so add using db.collectionConfig()
const collectionConfigs: CollectionConfig[] = [
  { name: 'app', schema: appSchema },
  { name: 'person', schema: personSchema },
];

export const newLocalDB = async (dbName = 'eduvault-api') => {
  try {
    // const db = await new Database(dbName, ...collectionConfigs); // TODO: try this later
    const db = await new Database(dbName);
    collectionConfigs.forEach(
      async (config) => await db.collectionConfig(config)
    );
    await db.open(2);
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
  const db = await Client.withKeyInfo({
    key: TEXTILE_USER_API_KEY,
    secret: TEXTILE_USER_API_SECRET,
  });
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
