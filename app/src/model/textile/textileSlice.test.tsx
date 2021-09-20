import {
  textileReducer,
  setState,
  initialState,
  setSyncing,
} from './textileSlice';
import { TextileState } from './types';
describe('textileReducer', () => {
  const initialTestState: TextileState = {
    syncing: true,
  };
  it('should handle initial state', () => {
    expect(textileReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );

    expect(textileReducer(undefined, setState(initialTestState))).toEqual(
      initialTestState
    );
  });
  it('should set syncing', () => {
    const expected = false;
    const actual = textileReducer(initialTestState, setSyncing(false));
    expect(actual.syncing).toEqual(expected);
  });
});
