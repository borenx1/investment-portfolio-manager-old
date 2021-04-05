import { createTradingJournal, Journal, Transaction, Asset } from "./account";
import { addTransactionOrdered, dateToString, getDecimalColumnPrecision, isRightAlignJournalColumnType, journalColumnRoleDisplay, transactionDataDisplay } from "./accountFunctions";

describe('dateToString', () => {
  test('expected (with time)', () => {
    expect(dateToString(new Date(2020, 0, 1))).toEqual('2020-01-01T00:00:00');
    expect(dateToString(new Date('01/01/2021'))).toEqual('2021-01-01T00:00:00');
    expect(dateToString(new Date(2020, 11, 12, 20, 10))).toEqual('2020-12-12T20:10:00');
    expect(dateToString(new Date(111, 1, 1, 20, 0))).toEqual('0111-02-01T20:00:00');
  });
  test('expected (no time)', () => {
    expect(dateToString(new Date(2021, 0, 1), false)).toEqual('2021-01-01');
    expect(dateToString(new Date(2020, 6, 12, 20, 10), false)).toEqual('2020-07-12');
    expect(dateToString(new Date(111, 1, 1, 20, 0), false)).toEqual('0111-02-01');
  });
});

describe('journalColumnRoleDisplay', () => {
  test('expected values', () => {
    expect(journalColumnRoleDisplay('date')).toEqual('Date');
    expect(journalColumnRoleDisplay('base')).toEqual('Base');
    expect(journalColumnRoleDisplay('baseAmount')).toEqual('Base amount');
    expect(journalColumnRoleDisplay('quote')).toEqual('Quote');
    expect(journalColumnRoleDisplay('quoteAmount')).toEqual('Quote amount');
    expect(journalColumnRoleDisplay('price')).toEqual('Price');
    expect(journalColumnRoleDisplay('feeBase')).toEqual('Base fee');
    expect(journalColumnRoleDisplay('feeQuote')).toEqual('Quote fee');
    expect(journalColumnRoleDisplay('notes')).toEqual('Notes');
    expect(journalColumnRoleDisplay(0)).toEqual('Extra (1)');
    expect(journalColumnRoleDisplay(1)).toEqual('Extra (2)');
    expect(journalColumnRoleDisplay(10)).toEqual('Extra (11)');
    expect(journalColumnRoleDisplay(1.26246)).toEqual('Extra (2)');
    expect(journalColumnRoleDisplay(-1)).toEqual('Extra (0)');
    expect(journalColumnRoleDisplay(undefined)).toBeUndefined();
    expect(journalColumnRoleDisplay(null)).toBeNull();
  });
});

describe('isRightAlignJournalColumnType', () => {
  test('expected values', () => {
    expect(isRightAlignJournalColumnType('date')).toBe(true);
    expect(isRightAlignJournalColumnType('decimal')).toBe(true);
    expect(isRightAlignJournalColumnType('integer')).toBe(true);
    expect(isRightAlignJournalColumnType('asset')).toBe(false);
    expect(isRightAlignJournalColumnType('boolean')).toBe(false);
    expect(isRightAlignJournalColumnType('text')).toBe(false);
  });
});

describe('testTransaction', () => {
  const testTransaction: Transaction = {
    date: '2021-01-01',
    base: 'BTC',
    baseAmount: 2,
    quote: 'USD',
    quoteAmount: 90000,
    feeBase: 0,
    feeQuote: 45,
    notes: 'Test transaction',
    extra: {},
  };
  const testJournal: Journal = createTradingJournal('Test journal');
  const testJournalPrecision: Journal = createTradingJournal('Test journal');
  testJournalPrecision.columns['baseAmount'].precision = {BTC: 4};
  testJournalPrecision.columns['quoteAmount'].precision = {USD: 3};
  testJournalPrecision.columns['price'].precision = {'BTC/USD': 5};
  const testAssets: Asset[] = [
    {
      ticker: 'USD',
      name: 'United States Dollar',
      precision: 2,
      pricePrecision: 2,
      isCurrency: true,
      symbol: '$',
    },
    {
      ticker: 'BTC',
      name: 'Bitcoin',
      precision: 8,
      pricePrecision: 2,
      isCurrency: true,
      symbol: '₿',
    }
  ];
  describe('getDecimalColumnPrecision', () => {
    test('expected values', () => {
      expect(getDecimalColumnPrecision(testJournal.columns['baseAmount'], 'BTC', '', testAssets)).toEqual(8);
      expect(getDecimalColumnPrecision(testJournal.columns['quoteAmount'], '', 'USD', testAssets)).toEqual(2);
      expect(getDecimalColumnPrecision(testJournal.columns['quoteAmount'], 'USD', 'BTC', testAssets)).toEqual(8);
      expect(getDecimalColumnPrecision(testJournal.columns['price'], 'BTC', 'USD', testAssets)).toEqual(2);
      expect(getDecimalColumnPrecision(testJournal.columns['feeBase'], 'BTC', 'USD', testAssets)).toEqual(8);
      expect(getDecimalColumnPrecision(testJournal.columns['feeQuote'], 'BTC', 'USD', testAssets)).toEqual(2);
      expect(getDecimalColumnPrecision(testJournalPrecision.columns['baseAmount'], 'BTC', 'USD', testAssets)).toEqual(4);
      expect(getDecimalColumnPrecision(testJournalPrecision.columns['quoteAmount'], 'BTC', 'USD', testAssets)).toEqual(3);
      expect(getDecimalColumnPrecision(testJournalPrecision.columns['price'], 'BTC', 'USD', testAssets)).toEqual(5);
    });
    test('NaN results', () => {
      expect(getDecimalColumnPrecision(testJournal.columns['baseAmount'], 'ETH', 'USD', testAssets)).toEqual(NaN);
      expect(getDecimalColumnPrecision(testJournal.columns['baseAmount'], '', 'USD', testAssets)).toEqual(NaN);
      expect(getDecimalColumnPrecision(testJournal.columns['quoteAmount'], 'BTC', '', testAssets)).toEqual(NaN);
      expect(getDecimalColumnPrecision(testJournal.columns['price'], '', 'USD', testAssets)).toEqual(NaN);
      expect(getDecimalColumnPrecision(testJournal.columns['price'], '123', 'USD', testAssets)).toEqual(NaN);
    });
  });
  describe('transactionDataDisplay', () => {
    test('expected values', () => {
      expect(transactionDataDisplay(testTransaction, 'date', testJournal, [], 'en-AU')).toEqual('01/01/2021');
      expect(transactionDataDisplay(testTransaction, 'base', testJournal)).toEqual('BTC');
      expect(transactionDataDisplay(testTransaction, 'quote', testJournal)).toEqual('USD');
      expect(transactionDataDisplay(testTransaction, 'notes', testJournal)).toEqual('Test transaction');
      expect(transactionDataDisplay(testTransaction, 'baseAmount', testJournal, testAssets)).toEqual('2.00000000');
      expect(transactionDataDisplay(testTransaction, 'quoteAmount', testJournal, testAssets)).toEqual('90000.00');
      expect(transactionDataDisplay(testTransaction, 'price', testJournal, testAssets)).toEqual('45000.00');
      expect(transactionDataDisplay(testTransaction, 'feeBase', testJournal, testAssets)).toEqual('0.00000000');
      expect(transactionDataDisplay(testTransaction, 'feeQuote', testJournal, testAssets)).toEqual('45.00');
    });
    test('missing asset settings', () => {
      expect(transactionDataDisplay(testTransaction, 'baseAmount', testJournal)).toEqual('2');
      expect(transactionDataDisplay(testTransaction, 'price', testJournal)).toEqual('45000');
    });
    test('column precision settings', () => {
      expect(transactionDataDisplay(testTransaction, 'baseAmount', testJournalPrecision, testAssets)).toEqual('2.0000');
      expect(transactionDataDisplay(testTransaction, 'quoteAmount', testJournalPrecision, testAssets)).toEqual('90000.000');
      expect(transactionDataDisplay(testTransaction, 'price', testJournalPrecision, testAssets)).toEqual('45000.00000');
    });
  });
});

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