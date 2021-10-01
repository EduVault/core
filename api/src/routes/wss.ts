import Emittery from 'emittery'; // use the emitter to send events to ourself (the challenge)
import http from 'http';
import https from 'https';
import { UserAuth as PersonAuth } from '@textile/security';
import WebSocket from 'ws';

import { validateAndDecodeJwt } from '../helpers';
import * as config from '../config';
import { findAppByID, findPersonByID, newClientDB, getAPISig } from '../db';
import { JWTToken, WsMessageData } from './types';
import { Client, Database } from '@textile/threaddb';

const tokenChallengeMessageHandlers = async ({
  data,
  client,
  emitter,
  ws,
  db,
  sendMessage,
}: {
  data: WsMessageData;
  client: Client;
  emitter: Emittery;
  ws: WebSocket;
  db: Database;
  sendMessage: (message: WsMessageData) => void;
}) => {
  const { decoded, error } = await validateAndDecodeJwt<JWTToken>(data.jwt);
  // console.log({ decoded, error });

  if (error) throw new Error('invalid jwt');

  // add a param isPerson or isApp
  const person = await findPersonByID(db, decoded.data.personID);
  const app = await findAppByID(db, decoded.data.appID);
  // console.log({ person, app });
  if (!(person || app)) throw 'could not find person/app';

  const handleTokenRequest = async () => {
    if (!data.pubKey) throw 'missing pubkey';

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
          console.log('challenge-response signature', signature);
          resolve(Buffer.from(signature));
        });
        setTimeout(() => {
          reject();
          if (!received) {
            console.log('client took too long to respond');
          }
        }, 10000);
      });
    };
    const token = await client.getTokenChallenge(
      data.pubKey,
      sendTokenChallenge
    );

    /**
     * The challenge was successfully completed by the client
     */
    // console.log('challenge completed');
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
    console.log('got signature response', data.signature);
    await emitter.emit('challenge-response', data.signature);
  };
  return { handleTokenRequest, challengeResponse };
};
const makeSendMessage = (ws: WebSocket) => (message: WsMessageData) => {
  ws.send(JSON.stringify(message));
};
export const startWss = async (
  server: http.Server | https.Server,
  db: Database
) => {
  const wss = new WebSocket.Server({ server, path: '/api/ws' });
  const emitter = new Emittery();
  const client = await newClientDB();

  wss.on('connection', (ws: WebSocket) => {
    //connection is up, let's add a simple simple event
    ws.on('message', async (message: string) => {
      const sendMessage = makeSendMessage(ws);
      try {
        const data = JSON.parse(message);
        console.log('=================wss message===================\n', data);
        if (!data.jwt) return ws.send(`jwt missing`);

        const { handleTokenRequest, challengeResponse } =
          await tokenChallengeMessageHandlers({
            sendMessage,
            data,
            client,
            ws,
            db,
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
        console.log(error);
        sendMessage({
          type: 'error',
          error: error.message,
        });
      }
    });
  });
};

// const generateChallenge = async (pubKey: string) => {
//   if (!pubKey) {
//     throw new Error('missing public key');
//   }
//   const db = await newClientDB();
//   let response: Uint8Array;
//   db.getToken()
//   const token = await db.getTokenChallenge(pubKey, (challenge) => {
//     response = challenge;
//   });

//   return JSON.stringify(Buffer.from(response).toJSON());
// };
