import {
  DateColumn,
  AssetColumn,
  TextColumn,
  IntegerColumn,
  DecimalColumn,
  BooleanColumn,
  isDateColumn,
  isAssetColumn,
  isTextColumn,
  isIntegerColumn,
  isDecimalColumn,
  isBaseAmountColumn,
  isQuoteAmountColumn,
  isPriceColumn,
  isBooleanColumn,
  isExtraColumn,
  isJournalType,
  isJournalColumnRole,
  isDateColumnFormat,
  isDecimalColumnDescription,
} from './account';

const testDateColumn: DateColumn = {name: 'Date', hide: false, format: 'date', type: 'date'};
const testAssetColumn: AssetColumn = {name: 'Asset', hide: false, type: 'asset'};
const testTextColumn: TextColumn = {name: 'Text', hide: false, type: 'text'};
const testIntegerColumn: IntegerColumn = {name: 'Integer', hide: false, type: 'integer'};
const testDecimalColumn: DecimalColumn = {name: 'Decimal', hide: false, precision: {}, description: 'base', type: 'decimal'};
const testBooleanColumn: BooleanColumn = {name: 'Boolean', hide: false, type: 'boolean'};

describe('journal column type predicates', () => {
  test('isDateColumn type predicate', () => {
    expect(isDateColumn({name: 'Column', hide: false})).toBe(false);
    expect(isDateColumn(testDateColumn)).toBe(true);
    expect(isDateColumn(testAssetColumn)).toBe(false);
    expect(isDateColumn(testTextColumn)).toBe(false);
    expect(isDateColumn(testIntegerColumn)).toBe(false);
    expect(isDateColumn(testDecimalColumn)).toBe(false);
    expect(isDateColumn(testBooleanColumn)).toBe(false);
  });
  test('isAssetColumn type predicate', () => {
    expect(isAssetColumn({name: 'Column', hide: false})).toBe(false);
    expect(isAssetColumn(testDateColumn)).toBe(false);
    expect(isAssetColumn(testAssetColumn)).toBe(true);
    expect(isAssetColumn(testTextColumn)).toBe(false);
    expect(isAssetColumn(testIntegerColumn)).toBe(false);
    expect(isAssetColumn(testDecimalColumn)).toBe(false);
    expect(isAssetColumn(testBooleanColumn)).toBe(false);
  });
  test('isTextColumn type predicate', () => {
    expect(isTextColumn({name: 'Column', hide: false})).toBe(false);
    expect(isTextColumn(testDateColumn)).toBe(false);
    expect(isTextColumn(testAssetColumn)).toBe(false);
    expect(isTextColumn(testTextColumn)).toBe(true);
    expect(isTextColumn(testIntegerColumn)).toBe(false);
    expect(isTextColumn(testDecimalColumn)).toBe(false);
    expect(isTextColumn(testBooleanColumn)).toBe(false);
  });
  test('isIntegerColumn type predicate', () => {
    expect(isIntegerColumn({name: 'Column', hide: false})).toBe(false);
    expect(isIntegerColumn(testDateColumn)).toBe(false);
    expect(isIntegerColumn(testAssetColumn)).toBe(false);
    expect(isIntegerColumn(testTextColumn)).toBe(false);
    expect(isIntegerColumn(testIntegerColumn)).toBe(true);
    expect(isIntegerColumn(testDecimalColumn)).toBe(false);
    expect(isIntegerColumn(testBooleanColumn)).toBe(false);
  });
  test('isDecimalColumn type predicate', () => {
    expect(isDecimalColumn({name: 'Column', hide: false})).toBe(false);
    expect(isDecimalColumn(testDateColumn)).toBe(false);
    expect(isDecimalColumn(testAssetColumn)).toBe(false);
    expect(isDecimalColumn(testTextColumn)).toBe(false);
    expect(isDecimalColumn(testIntegerColumn)).toBe(false);
    expect(isDecimalColumn(testDecimalColumn)).toBe(true);
    expect(isDecimalColumn(testBooleanColumn)).toBe(false);
  });
  test('isBaseAmountColumn type predicate', () => {
    expect(isBaseAmountColumn({name: 'Column', hide: false})).toBe(false);
    expect(isBaseAmountColumn(testDateColumn)).toBe(false);
    expect(isBaseAmountColumn(testAssetColumn)).toBe(false);
    expect(isBaseAmountColumn(testTextColumn)).toBe(false);
    expect(isBaseAmountColumn(testIntegerColumn)).toBe(false);
    expect(isBaseAmountColumn({...testDecimalColumn, description: 'base'})).toBe(true);
    expect(isBaseAmountColumn({...testDecimalColumn, description: 'quote'})).toBe(false);
    expect(isBaseAmountColumn({...testDecimalColumn, description: 'price'})).toBe(false);
    expect(isBaseAmountColumn(testBooleanColumn)).toBe(false);
  });
  test('isQuoteAmountColumn type predicate', () => {
    expect(isQuoteAmountColumn({name: 'Column', hide: false})).toBe(false);
    expect(isQuoteAmountColumn(testDateColumn)).toBe(false);
    expect(isQuoteAmountColumn(testAssetColumn)).toBe(false);
    expect(isQuoteAmountColumn(testTextColumn)).toBe(false);
    expect(isQuoteAmountColumn(testIntegerColumn)).toBe(false);
    expect(isQuoteAmountColumn({...testDecimalColumn, description: 'base'})).toBe(false);
    expect(isQuoteAmountColumn({...testDecimalColumn, description: 'quote'})).toBe(true);
    expect(isQuoteAmountColumn({...testDecimalColumn, description: 'price'})).toBe(false);
    expect(isQuoteAmountColumn(testBooleanColumn)).toBe(false);
  });
  test('isPriceColumn type predicate', () => {
    expect(isPriceColumn({name: 'Column', hide: false})).toBe(false);
    expect(isPriceColumn(testDateColumn)).toBe(false);
    expect(isPriceColumn(testAssetColumn)).toBe(false);
    expect(isPriceColumn(testTextColumn)).toBe(false);
    expect(isPriceColumn(testIntegerColumn)).toBe(false);
    expect(isPriceColumn({...testDecimalColumn, description: 'base'})).toBe(false);
    expect(isPriceColumn({...testDecimalColumn, description: 'quote'})).toBe(false);
    expect(isPriceColumn({...testDecimalColumn, description: 'price'})).toBe(true);
    expect(isPriceColumn(testBooleanColumn)).toBe(false);
  });
  test('isBooleanColumn type predicate', () => {
    expect(isBooleanColumn({name: 'Column', hide: false})).toBe(false);
    expect(isBooleanColumn(testDateColumn)).toBe(false);
    expect(isBooleanColumn(testAssetColumn)).toBe(false);
    expect(isBooleanColumn(testTextColumn)).toBe(false);
    expect(isBooleanColumn(testIntegerColumn)).toBe(false);
    expect(isBooleanColumn(testDecimalColumn)).toBe(false);
    expect(isBooleanColumn(testBooleanColumn)).toBe(true);
  });
  test('isExtraColumn type predicate', () => {
    expect(isExtraColumn({name: 'Column', hide: false})).toBe(false);
    expect(isExtraColumn(testDateColumn)).toBe(false);
    expect(isExtraColumn(testAssetColumn)).toBe(false);
    expect(isExtraColumn(testTextColumn)).toBe(true);
    expect(isExtraColumn(testIntegerColumn)).toBe(true);
    expect(isExtraColumn(testDecimalColumn)).toBe(true);
    expect(isExtraColumn(testBooleanColumn)).toBe(true);
  });
  test('isJournalType type predicate', () => {
    expect(isJournalType('trading')).toBe(true);
    expect(isJournalType('income')).toBe(true);
    expect(isJournalType('expense')).toBe(true);
    expect(isJournalType(undefined)).toBe(false);
    expect(isJournalType(null)).toBe(false);
    expect(isJournalType(true)).toBe(false);
    expect(isJournalType('')).toBe(false);
    expect(isJournalType('expenses')).toBe(false);
    expect(isJournalType('Trading')).toBe(false);
  });
  test('isJournalColumnRole type predicate', () => {
    expect(isJournalColumnRole(0)).toBe(true);
    expect(isJournalColumnRole(1)).toBe(true);
    expect(isJournalColumnRole(-1)).toBe(true);
    expect(isJournalColumnRole('date')).toBe(true);
    expect(isJournalColumnRole('base')).toBe(true);
    expect(isJournalColumnRole('baseAmount')).toBe(true);
    expect(isJournalColumnRole('quote')).toBe(true);
    expect(isJournalColumnRole('quoteAmount')).toBe(true);
    expect(isJournalColumnRole('price')).toBe(true);
    expect(isJournalColumnRole('feeBase')).toBe(true);
    expect(isJournalColumnRole('feeQuote')).toBe(true);
    expect(isJournalColumnRole('notes')).toBe(true);
    expect(isJournalColumnRole(undefined)).toBe(false);
    expect(isJournalColumnRole(null)).toBe(false);
    expect(isJournalColumnRole(true)).toBe(false);
    expect(isJournalColumnRole('')).toBe(false);
    expect(isJournalColumnRole('extra')).toBe(false);
    expect(isJournalColumnRole('Date')).toBe(false);
    expect(isJournalColumnRole('1')).toBe(false);
  });
  test('isDateColumnFormat type predicate', () => {
    expect(isDateColumnFormat('date')).toBe(true);
    expect(isDateColumnFormat('datetime')).toBe(true);
    expect(isDateColumnFormat(undefined)).toBe(false);
    expect(isDateColumnFormat(null)).toBe(false);
    expect(isDateColumnFormat(true)).toBe(false);
    expect(isDateColumnFormat('')).toBe(false);
    expect(isDateColumnFormat('time')).toBe(false);
    expect(isDateColumnFormat('Date')).toBe(false);
  });
  test('isDecimalColumnDescription type predicate', () => {
    expect(isDecimalColumnDescription('base')).toBe(true);
    expect(isDecimalColumnDescription('quote')).toBe(true);
    expect(isDecimalColumnDescription('price')).toBe(true);
    expect(isDecimalColumnDescription(undefined)).toBe(false);
    expect(isDecimalColumnDescription(null)).toBe(false);
    expect(isDecimalColumnDescription(true)).toBe(false);
    expect(isDecimalColumnDescription('')).toBe(false);
    expect(isDecimalColumnDescription('Base')).toBe(false);
    expect(isDecimalColumnDescription('baseAmount')).toBe(false);
  });
});