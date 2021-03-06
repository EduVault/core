import CryptoJS from 'crypto-js';
import * as bcrypt from 'bcryptjs';

export function encrypt(content: any, encryptKey: string) {
  // console.log('encrypting', { content, encryptKey });
  if (!content) {
    console.log('no encryption content');
    return null;
  }
  if (!encryptKey) {
    console.log('no encryption key');
    return null;
  }
  try {
    let encJson = CryptoJS.AES.encrypt(
      JSON.stringify(content),
      encryptKey
    ).toString();
    const encrypted = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(encJson)
    );
    // console.log({ encrypted });
    return encrypted;
  } catch (error) {
    console.log('error encrypting', error);
    return null;
  }
}

export function decrypt(content: string, decryptKey: string) {
  // console.log('decrypting', { content, decryptKey });
  try {
    let decData = CryptoJS.enc.Base64.parse(content).toString(
      CryptoJS.enc.Utf8
    );
    let decryptedBytes = CryptoJS.AES.decrypt(decData, decryptKey).toString(
      CryptoJS.enc.Utf8
    );
    return JSON.parse(decryptedBytes);
  } catch (error) {
    console.log('decryption error', error);
    return false;
  }
}

export function hash(content: string) {
  return CryptoJS.SHA256(content).toString();
}

export const hashPassword = (password: string) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validPassword = function (
  providedPassword: string,
  storedPassword: string
) {
  // console.log('password compare', providedPassword, storedPassword);
  try {
    return bcrypt.compareSync(providedPassword, storedPassword);
  } catch (error) {
    return false;
  }
};

import { PrivateKey } from '@textile/hub';

export const generatePrivateKey = async (): Promise<PrivateKey> => {
  return await PrivateKey.fromRandom();
};
