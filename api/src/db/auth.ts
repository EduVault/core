import { createAPISig, UserAuth as PersonAuth, PrivateKey } from '@textile/hub';
import { TEXTILE_USER_API_KEY } from '../config';
import { newClientDB } from './init';

/** @param seconds (300) time until the sig expires */
export const getAPISig = async (seconds: number = 300) => {
  try {
    // await console.log('getting API sig');
    const expiration = await new Date(Date.now() + 1000 * seconds);
    // console.log('API sig expiration', expiration);
    const signature = await createAPISig(TEXTILE_USER_API_KEY, expiration);
    return signature;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

export const localChallengeHandler = (id: PrivateKey) => {
  const challengeFunc = async (challenge: Uint8Array): Promise<Uint8Array> => {
    return await id.sign(challenge);
  };
  return challengeFunc;
};

export const generatePersonAuth = async (
  pubkey: string,
  challengeHandler: (challenge: Uint8Array) => Uint8Array | Promise<Uint8Array>
): Promise<PersonAuth> => {
  const db = await newClientDB();
  const token = await db.getTokenChallenge(pubkey, challengeHandler);
  const signature = await getAPISig();
  return {
    ...signature,
    token: token,
    key: TEXTILE_USER_API_KEY,
  } as PersonAuth;
};

export const localPersonAuth = async (id: PrivateKey) => {
  return await generatePersonAuth(
    id.public.toString(),
    localChallengeHandler(id)
  );
};
