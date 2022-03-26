import { JSONSchema } from '@textile/threaddb';
export interface IApp {
  _id: string;
  devID: string;
  name: string;
  description?: string;
  authorizedDomains?: string[];
  // persons?: string[]; // users of the app. no use-case yet
}
export const appSchema: JSONSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  // id: 'https://github.com/eduvault/eduvault/app',
  title: 'App',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    devID: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    authorizedDomains: { type: 'array', items: { type: 'string' } },
    // persons: { type: 'array', items: { type: 'string' } },
  },
};
