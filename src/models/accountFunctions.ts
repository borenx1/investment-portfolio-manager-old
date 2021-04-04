import BigNumber from "bignumber.js";
import {
  Asset,
  Transaction,
  Journal,
  DateColumn,
  AssetColumn,
  DecimalColumn,
  BaseAmountColumn,
  QuoteAmountColumn,
  PriceColumn,
  TextColumn,
  ExtraColumn,
  JournalColumn,
  JournalColumnRole,
  JournalColumnType,
  isDecimalColumn,
  isBooleanColumn,
  isDateColumn,
} from "./account";
import { roundDown } from "./math";

/**
 * Convert a date to "yyyy-mm-ddThh:mm:ss" or "yyyy-mm-dd". Compatible with DateColumn.
 */
export function dateToString(date: Date, time: boolean = true) {
  let dateString = `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  if (!time) {
    return dateString;
  }
  return `${dateString}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

export function journalColumnRoleDisplay(role: JournalColumnRole | undefined | null) {
  switch (role) {
    case undefined:
    case null:
      return role;
    case 'date':
      return 'Date';
    case 'base':
      return 'Base';
    case 'baseAmount':
      return 'Base amount';
    case 'quote':
      return 'Quote';
    case 'quoteAmount':
      return 'Quote amount';
    case 'price':
      return 'Price';
    case 'feeBase':
      return 'Base fee';
    case 'feeQuote':
      return 'Quote fee';
    case 'notes':
      return 'Notes';
    default:    // Implicit typeof role = number
      return `Extra (${(role + 1).toFixed()})`;
  }
}

// This code is too janky, use overloads instead, see below
// export function getJournalColumn<T extends JournalColumnRole>(journal: Journal, role: T): T extends number ? ExtraColumn : JournalColumn {
//   if (typeof role === 'number') {
//     return journal.columns.extra[role as number] as T extends number ? ExtraColumn : JournalColumn;
//   } else {
//     return journal.columns[role as JournalCoreColumnRole] as T extends number ? ExtraColumn : JournalColumn;
//   }
// }

// TODO add tests
// TODO note that this can sometimes return undefined (index out of range)
export function getJournalColumn(journal: Journal, role: number): ExtraColumn;
export function getJournalColumn(journal: Journal, role: 'date'): DateColumn;
export function getJournalColumn(journal: Journal, role: 'base' | 'quote'): AssetColumn;
export function getJournalColumn(journal: Journal, role: 'baseAmount' | 'feeBase'): BaseAmountColumn;
export function getJournalColumn(journal: Journal, role: 'quoteAmount' | 'feeQuote'): QuoteAmountColumn;
export function getJournalColumn(journal: Journal, role: 'price'): PriceColumn;
export function getJournalColumn(journal: Journal, role: 'baseAmount' | 'feeBase' | 'quoteAmount' | 'feeQuote' | 'price'): DecimalColumn;
export function getJournalColumn(journal: Journal, role: 'notes'): TextColumn;
export function getJournalColumn(journal: Journal, role: Exclude<JournalColumnRole, number>): JournalColumn;
export function getJournalColumn(journal: Journal, role: JournalColumnRole): JournalColumn;
export function getJournalColumn(journal: Journal, role: JournalColumnRole) {
  if (typeof role === 'number') {
    return journal.columns.extra[role];
  } else {
    return journal.columns[role];
  }
}

export function isRightAlignJournalColumnType(type: JournalColumnType): boolean {
  return ['date', 'integer', 'decimal'].indexOf(type) !== -1;
}

/**
 * Gets a Decimal Journal Columns's precision from the column settings or default precision.
 * @param column The Decimal Column settings.
 * @param baseTicker The ticker of the base asset/currency. Empty strings are invalid.
 * @param quoteTicker The ticker of the quote asset/currency. Empty strings are invalid.
 * @param assets The assets to get the precision from. The baseTicker and quoteTicker will attempt to get the precision here.
 * @returns The precision (number of decimal places) of this column, or NaN if unable get a precision.
 */
export function getDecimalColumnPrecision(column: DecimalColumn, baseTicker: string, quoteTicker: string, assets: Asset[] = []): number {
  const base = baseTicker ? assets.find(a => a.ticker === baseTicker) : undefined;
  const quote = quoteTicker ? assets.find(a => a.ticker === quoteTicker) : undefined;
  switch (column.description) {
    case 'base':
      return baseTicker ? (column.precision[baseTicker] ?? base?.precision ?? NaN) : NaN;
    case 'quote':
      return quoteTicker ? (column.precision[quoteTicker] ?? quote?.precision ?? NaN) : NaN;
    case 'price':
      return (baseTicker && quoteTicker) ? (column.precision[`${baseTicker}/${quoteTicker}`] ?? base?.pricePrecision ?? NaN) : NaN;
    default:
      console.warn(`getDecimalColumnPrecision: Uncatched deciaml column description: ${column.description}.`);
      return NaN;
  }
}

/**
 * Formats a transaction's value to the correct decimal places depending on the column and asset settings.
 * @param value The value to format. String values are attempted to be coerced into numbers.
 * @param column The column settings.
 * @param baseTicker The ticker of the base asset/currency.
 * @param quoteTicker The ticker of the quote asset/currency.
 * @param assets The assets to get the settings of. The baseTicker and quoteTicker will attempt to get the settings here.
 * @returns A formatted string with the correct decimal places, or the original value of could not get the precision settings.
 */
function formatTransactionDecimalColumn(value: number | string, column: DecimalColumn, baseTicker: string, quoteTicker: string, assets: Asset[] = []): string {
  if (!new BigNumber(value).isNaN()) {
    const precision = getDecimalColumnPrecision(column, baseTicker, quoteTicker, assets);
    return isNaN(precision) ? new BigNumber(value).toFixed() : roundDown(value, precision).toFixed(precision);
  } else if (typeof value === 'number' && isNaN(value)) {
    return '';
  }
  return String(value);
}
// TODO find way to convert number <-> string <-> boolean
/**
 * Format a transaction value to display in a table to the user.
 * @param transaction The transaction to format.
 * @param role The column of the transaction to display.
 * @param journal The journal to get the column settings from.
 * @param assets A list of assets to get the precision settings from (for decimal columns).
 * @returns A formatted string representing the transaction's value to be displayed to the user.
 */
export function transactionDataDisplay(transaction: Transaction, role: JournalColumnRole, journal: Journal, assets: Asset[] = [], dateLocale?: string): string {
  const column = getJournalColumn(journal, role);
  // Could be undefined due to extra column does not exist
  let data: number | string | boolean | undefined;
  if (role === 'price') {
    data = new BigNumber(transaction.quoteAmount).div(new BigNumber(transaction.baseAmount)).abs().toNumber();
  } else if (typeof role === 'number') {
    data = transaction.extra[column.name];
  } else {
    data = transaction[role];
  }

  if (isDecimalColumn(column) && (typeof data === 'number' || typeof data === 'string')) {
    return formatTransactionDecimalColumn(data, column, transaction.base, transaction.quote, assets);
  } else if (isDateColumn(column) && typeof data === 'string') {
    return column.showTime ? new Date(data).toLocaleString(dateLocale) : new Date(data).toLocaleDateString(dateLocale);
  } else if (isBooleanColumn(column)) {
    return data ? 'Yes' : 'No';
  } else if (data === undefined || (typeof data === 'number' && isNaN(data))) {
    return '';
  }
  return String(data);
}