export type AuthType =
  | 'google'
  | 'facebook'
  | 'dotwallet'
  | 'password'
  | 'metamask'
  | 'default';

export interface AuthState {
  loggedIn: boolean;
  authType: AuthType;
  jwt?: string;
  pubKey?: string;
  privateKey?: string;
  jwtEncryptedPrivateKey?: string;
  threadID?: string;
  threadIDStr?: string;
}
