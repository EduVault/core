import { authReducer, setLoggedIn } from './authSlice';
import { AuthState } from './types';
describe('authReducer', () => {
  const initialTestState: AuthState = {
    loggedIn: false,
    loggingIn: false,
    error: '',
  };
  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(
      initialTestState
    );
  });
  it('should set logged in', () => {
    const expected = false;
    const actual = authReducer(initialTestState, setLoggedIn(false));
    expect(actual.loggedIn).toEqual(expected);
  });
});
