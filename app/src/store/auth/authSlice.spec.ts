import { authReducer, setState, initialState, setLoggedIn } from './authSlice';
import { AuthState } from './types';
describe('authReducer', () => {
  const initialTestState: AuthState = {
    loggedIn: true,
    privateKey: 'privateKey',
    authType: 'google',
    jwt: 'jwt',
    pubKey: 'pubKey',
    threadID: 'threadID',
    threadIDStr: 'threadIDStr',
    jwtEncryptedPrivateKey: 'jwtEncryptedPrivateKey',
  };
  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);

    expect(authReducer(undefined, setState(initialTestState))).toEqual(
      initialTestState
    );
  });
  it('should set logged in', () => {
    const expected = false;
    const actual = authReducer(initialTestState, setLoggedIn(false));
    expect(actual.loggedIn).toEqual(expected);
  });
});
