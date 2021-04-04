import { createTradingJournal, Journal, Transaction, Asset } from "./account";
import { dateToString, getDecimalColumnPrecision, isRightAlignJournalColumnType, journalColumnRoleDisplay, transactionDataDisplay } from "./accountFunctions";

describe('dateToString', () => {
  test('expected values', () => {
    expect(dateToString(new Date(2020, 1, 1))).toEqual('2020-01-01T00:00:00');
    expect(dateToString(new Date(2020, 6, 12, 20, 10))).toEqual('2020-06-12T20:10:00');
    expect(dateToString(new Date(111, 1, 1, 20, 0))).toEqual('0111-01-01T20:00:00');
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

describe('testTransactions', () => {
  const testTransaction: Transaction = {
    date: '01/01/2021',
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
      expect(getDecimalColumnPrecision(testJournal.columns['baseAmount'], 'BTC', 'USD', testAssets)).toEqual(8);
      expect(getDecimalColumnPrecision(testJournal.columns['quoteAmount'], 'BTC', 'USD', testAssets)).toEqual(2);
      expect(getDecimalColumnPrecision(testJournal.columns['quoteAmount'], 'USD', 'BTC', testAssets)).toEqual(8);
      expect(getDecimalColumnPrecision(testJournal.columns['price'], 'BTC', 'USD', testAssets)).toEqual(2);
      expect(getDecimalColumnPrecision(testJournal.columns['feeBase'], 'BTC', 'USD', testAssets)).toEqual(8);
      expect(getDecimalColumnPrecision(testJournal.columns['feeQuote'], 'BTC', 'USD', testAssets)).toEqual(2);
      expect(getDecimalColumnPrecision(testJournalPrecision.columns['baseAmount'], 'BTC', 'USD', testAssets)).toEqual(4);
      expect(getDecimalColumnPrecision(testJournalPrecision.columns['quoteAmount'], 'BTC', 'USD', testAssets)).toEqual(3);
      expect(getDecimalColumnPrecision(testJournalPrecision.columns['price'], 'BTC', 'USD', testAssets)).toEqual(5);
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