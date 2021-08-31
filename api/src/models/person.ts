import { JSONSchema } from '@textile/threaddb';
// interface Dotwallet extends DotwalletProfile {
//   token: string;
// }
interface SocialMediaAccount {
  id?: string;
  token?: string;
  email?: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
}
const socialMediaAccountSchema: JSONSchema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  // id: 'https://github.com/eduvault/eduvault/SocialMediaAccount',
  title: 'SocialMediaAccount',
  type: 'object',
  properties: {
    id: { type: 'string' },
    token: { type: 'string' },
    email: { type: 'string' },
    givenName: { type: 'string' },
    familyName: { type: 'string' },
    picture: { type: 'string' },
  },
};

// const dotwalletProfileSchema:JSONSchema = {
//   $schema: 'http://json-schema.org/draft-04/schema#',
//   id: 'https://github.com/eduvault/eduvault/dotwalletProfile',
//   title: 'dotwalletProfile',
//   type: 'object',
//   properties: {
//     id: { type: 'string' },
//     token: { type: 'string' },
//     email: { type: 'string' },
//     givenName: { type: 'string' },
//     familyName: { type: 'string' },
//     picture: { type: 'string' },
//   },
// };
// export interface DotwalletProfile {
//   pay_status: number;
//   pre_amount: number;
//   total_amount: number;
//   person_address: string;
//   person_avatar: string;
//   person_name: string;
//   person_open_id: string;
// }
// export interface DotwalletAccessData {
//   access_token: string;
//   expires_in: number;
//   refresh_token: string;
// }
export interface Dev {
  isVerified: boolean;
  apps?: string[];
}
const devSchema: JSONSchema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  // id: 'https://github.com/eduvault/eduvault/Dev',
  title: 'Dev',
  type: 'object',
  properties: {
    isVerified: { type: 'boolean' },
    apps: { type: 'array', items: { type: 'string' } },
  },
};

/** @param username will be an email for local scheme, for google and facebook will be email if available or id if not */
export interface IPerson {
  _id: string;
  username: string;
  password?: string;
  pwEncryptedPrivateKey?: string;
  socialMediaPrivateKey?: string;
  pubKey?: string;
  threadIDStr?: string;
  DbInfo?: string;
  facebook?: SocialMediaAccount;
  google?: SocialMediaAccount;
  // dotwallet?: Dotwallet;
  dev?: Dev;
}
export const personSchema: JSONSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  // id: 'https://github.com/eduvault/eduvault/person',
  title: 'Person',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    username: { type: 'string' },
    password: { type: 'string' },
    pwEncryptedPrivateKey: { type: 'string' },
    socialMediaPrivateKey: { type: 'string' },
    pubKey: { type: 'string' },
    threadIDStr: { type: 'string' },
    DbInfo: { type: 'string' },
    google: socialMediaAccountSchema,
    facebook: socialMediaAccountSchema,
    dev: devSchema,
  },
};
