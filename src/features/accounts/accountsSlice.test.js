import store from '../../app/store';
import { changeAccount, selectActiveAccountIndex } from './accountsSlice';

test('default account is 0', () => {
  expect(selectActiveAccountIndex(store.getState())).toEqual(0);
});

test('change account', () => {
  store.dispatch(changeAccount(1));
  expect(selectActiveAccountIndex(store.getState())).toEqual(1);
  store.dispatch(changeAccount('2'));
  expect(selectActiveAccountIndex(store.getState())).toEqual(2);
});

test('change account to all', () => {
  store.dispatch(changeAccount(-1));
  expect(selectActiveAccountIndex(store.getState())).toEqual(-1);
});

test('change account to invalid value', () => {
  store.dispatch(changeAccount(1));
  store.dispatch(changeAccount('a'));
  expect(selectActiveAccountIndex(store.getState())).toEqual(0);
  store.dispatch(changeAccount(null));
  expect(selectActiveAccountIndex(store.getState())).toEqual(0);
  store.dispatch(changeAccount(-2));
  expect(selectActiveAccountIndex(store.getState())).toEqual(-1);
});