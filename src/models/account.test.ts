import {
  DateColumn,
  AssetColumn,
  TextColumn,
  IntegerColumn,
  DecimalColumn,
  BooleanColumn,
  ExtraColumn,
  JournalColumn,
  isExtraColumn,
} from './account';

describe('journal columns', () => {
  test('isExtraColumn type predicate', () => {
    let dateColumn: DateColumn = {name: 'Date', hide: false, format: 'date', type: 'date'};
    let assetColumn: AssetColumn = {name: 'Asset', hide: false, type: 'asset'};
    let textColumn: TextColumn = {name: 'Text', hide: false, type: 'text'};
    let integerColumn: IntegerColumn = {name: 'Integer', hide: false, type: 'integer'};
    let decimalColumn: DecimalColumn = {name: 'Decimal', hide: false, precision: {}, description: 'base', type: 'decimal'};
    let booleanColumn: BooleanColumn = {name: 'Boolean', hide: false, type: 'boolean'};
    expect(isExtraColumn(dateColumn)).toBe(false);
    expect(isExtraColumn(assetColumn)).toBe(false);
    expect(isExtraColumn(textColumn)).toBe(true);
    expect(isExtraColumn(integerColumn)).toBe(true);
    expect(isExtraColumn(decimalColumn)).toBe(true);
    expect(isExtraColumn(booleanColumn)).toBe(true);
  });
});