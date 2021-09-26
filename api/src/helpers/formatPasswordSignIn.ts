import { ThreadID, PrivateKey } from '@textile/hub';
import { PasswordLoginReq } from 'types';
import { encrypt, hash } from './encryption';

/** formats a request for password authentication. Creates new keys for sign ups */
export const formatPasswordSignIn = async ({
  username,
  password,
  redirectURL,
  appID,
}: {
  username: string;
  password: string;
  redirectURL: string;
  appID: string;
}) => {
  const privateKey = await PrivateKey.fromRandom();
  const pubKey = await privateKey.public.toString();
  const newThreadID = await ThreadID.fromRandom();
  const threadIDStr = newThreadID.toString();

  const pwEncryptedPrivateKey = encrypt(privateKey.toString(), password);
  if (!pwEncryptedPrivateKey)
    return { error: 'Could not encrypt private key with password' };
  const clientToken = (Math.random() * 20).toString();
  const personAuthReq: PasswordLoginReq = {
    username,
    password: hash(password),
    pwEncryptedPrivateKey,
    threadIDStr,
    pubKey,
    redirectURL: redirectURL ?? 'http//:localhost',
    appID,
    clientToken,
  };

  return personAuthReq;
};
