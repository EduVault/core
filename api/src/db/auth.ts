import { createAPISig } from '@textile/hub';
import { TEXTILE_USER_API_KEY } from '../config';

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
