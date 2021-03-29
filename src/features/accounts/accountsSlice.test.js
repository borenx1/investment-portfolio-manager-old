import store from '../../app/store';
import {
  switchAccount,
  addDefaultAccount,
  selectActiveAccountIndex,
  selectAccounts,
  selectActiveAccount,
} from './accountsSlice';

describe('activeAccount', () => {
  test('default account is 0', () => {
    expect(selectActiveAccountIndex(store.getState())).toEqual(0);
  });
  test('switch account', () => {
    store.dispatch(switchAccount(1));
    expect(selectActiveAccountIndex(store.getState())).toEqual(1);
    store.dispatch(switchAccount(2));
    expect(selectActiveAccountIndex(store.getState())).toEqual(2);
  });
  test('switch account to all', () => {
    store.dispatch(switchAccount(-1));
    expect(selectActiveAccountIndex(store.getState())).toEqual(-1);
    store.dispatch(switchAccount(-10));
    expect(selectActiveAccountIndex(store.getState())).toEqual(-1);
  });
  test('switch account to invalid value', () => {
    store.dispatch(switchAccount('a'));
    expect(selectActiveAccountIndex(store.getState())).toEqual(NaN);
    store.dispatch(switchAccount(null));
    expect(selectActiveAccountIndex(store.getState())).toEqual(0);
    store.dispatch(switchAccount());
    expect(selectActiveAccountIndex(store.getState())).toEqual(NaN);
  });
});

describe('account', () => {
  test('add account', () => {
    store.dispatch(addDefaultAccount('Test account'));
    expect(selectAccounts(store.getState()).length).toEqual(1);
  });
  test('get active account', () => {
    store.dispatch(switchAccount(0));
    const account = selectAccounts(store.getState())[0];
    expect(selectActiveAccount(store.getState())).toEqual(account);
    store.dispatch(switchAccount(Infinity));
    expect(selectActiveAccount(store.getState())).toBeNull();
  });
});