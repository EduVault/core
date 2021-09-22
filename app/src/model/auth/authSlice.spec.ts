import { authReducer, setState, initialState, setLoggedIn } from './authSlice';
import { AuthState } from './types';
describe('authReducer', () => {
  const initialTestState: AuthState = {
    loggedIn: true,
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
