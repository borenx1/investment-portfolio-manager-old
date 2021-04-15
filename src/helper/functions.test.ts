import {
  addTransactionOrdered,
} from './functions';
import { Transaction } from '../models/account';

describe('addTransactionOrdered', () => {
  const testTransaction: Transaction = {
    date: '2000-01-01',
    base: 'BTC',
    baseAmount: 1,
    quote: 'USD',
    quoteAmount: 10,
    feeBase: 0,
    feeQuote: 0,
    notes: 'Test transaction',
    extra: {},
  };
  const testTransactions: Transaction[] = [testTransaction];
  test('add newest transaction', () => {
    addTransactionOrdered(testTransactions, {
      ...testTransaction,
      date: '2000-01-31',
      notes: 'Test transaction 2',
    });
    // [1, 2]
    expect(testTransactions[0]?.notes).toEqual('Test transaction');
    expect(testTransactions[1]?.notes).toEqual('Test transaction 2');
  });
  test('add in between transaction', () => {
    addTransactionOrdered(testTransactions, {
      ...testTransaction,
      date: '2000-01-30',
      notes: 'Test transaction 3',
    });
    // [1, 3, 2]
    expect(testTransactions[1]?.notes).toEqual('Test transaction 3');
    expect(testTransactions[2]?.notes).toEqual('Test transaction 2');
  });
  test('add oldest transaction', () => {
    addTransactionOrdered(testTransactions, {
      ...testTransaction,
      date: '1999-12-12',
      notes: 'Test transaction 4',
    });
    // [4, 1, 3, 2]
    expect(testTransactions[0]?.notes).toEqual('Test transaction 4');
    expect(testTransactions[1]?.notes).toEqual('Test transaction');
    expect(testTransactions[3]?.notes).toEqual('Test transaction 2');
  });
  test('add transaction with time', () => {
    addTransactionOrdered(testTransactions, {
      ...testTransaction,
      date: '2000-01-30 18:00:00',
      notes: 'Test transaction 5',
    });
    // [4, 1, 3, 5, 2]
    expect(testTransactions[0]?.notes).toEqual('Test transaction 4');
    expect(testTransactions[2]?.notes).toEqual('Test transaction 3');
    expect(testTransactions[3]?.notes).toEqual('Test transaction 5');
    expect(testTransactions[4]?.notes).toEqual('Test transaction 2');
  });
});