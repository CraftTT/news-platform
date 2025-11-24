import reducer, { setAuthenticated } from '../slice';

describe('auth slice', () => {
  it('sets authenticated true', () => {
    const s1 = reducer(undefined, { type: '@@INIT' });
    const s2 = reducer(s1, setAuthenticated(true));
    expect(s2.authenticated).toBe(true);
  });

  it('sets authenticated false', () => {
    const s1 = reducer(undefined, setAuthenticated(true));
    const s2 = reducer(s1, setAuthenticated(false));
    expect(s2.authenticated).toBe(false);
  });
});