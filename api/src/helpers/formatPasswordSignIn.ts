import { ThreadID, PrivateKey } from '@textile/hub';
import { PasswordLoginReq } from 'types';
import { encrypt, hash } from './encryption';

/** formats a request for password authentication. Creates new keys for sign ups */
export const formatPasswordSignIn = async (options: {
  username?: string;
  password?: string;
  redirectURL?: string;
  appID?: string;
}) => {
  const privateKey = await PrivateKey.fromRandom();
  const pubKey = await privateKey.public.toString();
  const newThreadID = await ThreadID.fromRandom();
  const threadIDStr = newThreadID.toString();
  let error: string | null = '';
  if (!options.password) error += 'No password provided. ';
  if (!options.username) error += 'no username provided. ';
  let pwEncryptedPrivateKey;
  if (options.username && options.password)
    pwEncryptedPrivateKey = encrypt(privateKey.toString(), options.password);
  if (!pwEncryptedPrivateKey)
    error += 'Could not encrypt private key with password. ';

  const personAuthReq: PasswordLoginReq = {
    username: options.username,
    password: options.password ? hash(options.password) : undefined,
    pwEncryptedPrivateKey: pwEncryptedPrivateKey || undefined,
    threadIDStr,
    pubKey,
    redirectURL: options.redirectURL,
    appID: options.appID,
  };

  return personAuthReq;
};
