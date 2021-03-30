import {
  DateColumn,
  AssetColumn,
  TextColumn,
  IntegerColumn,
  DecimalColumn,
  BooleanColumn,
  ExtraColumn,
  JournalColumn,
  isDateColumn,
  isExtraColumn,
} from './account';

const testDateColumn: DateColumn = {name: 'Date', hide: false, format: 'date', type: 'date'};
const testAssetColumn: AssetColumn = {name: 'Asset', hide: false, type: 'asset'};
const testTextColumn: TextColumn = {name: 'Text', hide: false, type: 'text'};
const testIntegerColumn: IntegerColumn = {name: 'Integer', hide: false, type: 'integer'};
const testDecimalColumn: DecimalColumn = {name: 'Decimal', hide: false, precision: {}, description: 'base', type: 'decimal'};
const testBooleanColumn: BooleanColumn = {name: 'Boolean', hide: false, type: 'boolean'};

describe('journal columns', () => {
  test('isDateColumn type predicate', () => {
    expect(isDateColumn({name: 'Column', hide: false})).toBe(false);
    expect(isDateColumn(testDateColumn)).toBe(true);
    expect(isDateColumn(testAssetColumn)).toBe(false);
    expect(isDateColumn(testTextColumn)).toBe(false);
    expect(isDateColumn(testIntegerColumn)).toBe(false);
    expect(isDateColumn(testDecimalColumn)).toBe(false);
    expect(isDateColumn(testBooleanColumn)).toBe(false);
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
});