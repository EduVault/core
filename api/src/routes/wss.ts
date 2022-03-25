import Emittery from 'emittery'; // use the emitter to send events to ourself (the challenge)
import http from 'http';
import https from 'https';
import { UserAuth as PersonAuth } from '@textile/security';
import WebSocket from 'ws';

import { validateAndDecodeJwt } from '../helpers';
import * as config from '../config';
import { findAppByID, findPersonByID, newDBClientUser, getAPISig } from '../db';
import { JWTToken, WsMessageData } from './types';
import { Client, Database } from '@textile/threaddb';

const messageHandlers = async ({
  data,
  emitter,
  client,
  sendMessage,
}: {
  data: WsMessageData;
  emitter: Emittery;
  client: Client;
  sendMessage: (message: WsMessageData) => void;
}) => {
  const sendTokenChallenge = (challenge: Uint8Array): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      let response: WsMessageData = {
        type: 'challenge-request',
        challenge: Buffer.from(challenge).toJSON(),
      };
      sendMessage(response);

      let received = false;
      /** Wait for the challenge event from our event emitter */
      emitter.on('challenge-response', async (signature: string) => {
        received = true;
        resolve(Buffer.from(signature));
      });
      setTimeout(() => {
        if (!received) console.warn('client took too long to respond');
        reject();
      }, 10000);
    });
  };
  const handleTokenRequest = async () => {
    if (!data.pubKey) throw new Error('missing pubkey');
    // console.log('challenge completed');
    let token;

    try {
      token = await client.getTokenChallenge(data.pubKey, sendTokenChallenge);
    } catch (error) {
      console.log(error);
      if (JSON.stringify(error).includes('Auth expired')) {
        client = await newDBClientUser();
        token = await client.getTokenChallenge(data.pubKey, sendTokenChallenge);
      }
    }

    if (!token) throw new Error('unable to make token');

    const apiSig = await getAPISig(5000);
    const personAuth: PersonAuth = {
      ...apiSig,
      token: token,
      key: config.TEXTILE_USER_API_KEY,
    };
    sendMessage({
      type: 'token-response',
      personAuth,
    });
  };
  const challengeResponse = async () => {
    if (!data.signature) throw new Error('missing signature');
    // console.log('got signature response', data.signature);
    await emitter.emit('challenge-response', data.signature);
  };
  return { handleTokenRequest, challengeResponse };
};

const validatedJWTData = async (data: any) => {
  if (!data.jwt) throw new Error(`jwt missing`);
  const { decoded, error } = await validateAndDecodeJwt<JWTToken>(data.jwt);
  // console.log({ decoded, error });
  if (error) throw new Error('invalid jwt');
  return decoded.data;
};

const onWssMessage = async (
  message: string,
  ws: WebSocket,
  db: Database,
  emitter: Emittery<any>
) => {
  // console.log('=================wss message===================\n', data);
  const sendMessage = (message: WsMessageData) =>
    ws.send(JSON.stringify(message));
  try {
    const data = JSON.parse(message);
    const jwtData = await validatedJWTData(data);

    // add a param isPerson or isApp
    // will this ever be app?
    const person = await findPersonByID(db, jwtData.personID);
    const app = await findAppByID(db, jwtData.appID);
    // console.log({ person, app });
    if (!(person || app)) throw new Error('could not find person/app');
    let client = await newDBClientUser();

    const { handleTokenRequest, challengeResponse } = await messageHandlers({
      sendMessage,
      data,
      client,
      emitter,
    });

    switch (data.type) {
      case 'token-request': {
        await handleTokenRequest();
        break;
      }
      /** Waiting for a response from the client to the challenge above.
       * result will get sent back to resolve on the line: emitter.on('challenge', (signature) => {
       */
      case 'challenge-response': {
        await challengeResponse();
        break;
      }
    }
  } catch (error) {
    console.error(error);
    sendMessage({
      type: 'error',
      error: error.message,
    });
  }
};

export const startWss = async (
  server: http.Server | https.Server,
  db: Database
) => {
  const wss = new WebSocket.Server({ server, path: '/api/ws' });
  const emitter = new Emittery();
  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', async (message: string) => {
      onWssMessage(message, ws, db, emitter);
    });
  });
};
