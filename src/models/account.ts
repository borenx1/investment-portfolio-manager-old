export * from './accountFunctions';

/**
 * A trading account.
 * @param name Name of the account.
 * @param settings The account settings.
 * @param assets Managed assets of the account.
 * @param journals List of journals to manage transactions.
 */
export interface Account {
  name: string;
  settings: AccountSettings;
  assets: Asset[];
  journals: Journal[];
}
/**
 * Account settings.
 * @param accountingCurrency The accounting currency of the account.
 */
export interface AccountSettings {
  accountingCurrency: Asset;
}

/**
 * Asset settings.
 * @param ticker Ticker of the asset, e.g. BTC. This is the unique identifier of an asset.
 * @param name Name of the asset, e.g. Bitcoin.
 * @param precision The precision used to record amounts.
 * @param pricePrecision The default precision used to show prices.
 * @param isCurrency true if the asset is a currency.
 * @param symbol Optional. Symbol of the asset, e.g. '₿'.
 */
export interface Asset {
  // TODO: Ticker only letters, numbers and period (.)
  ticker: string;
  name: string;
  precision: number;
  pricePrecision: number;
  isCurrency: boolean;
  symbol?: string;
}

export type JournalType = 'trading' | 'income' | 'expense';
export function isJournalType(obj: any): obj is JournalType {
  return typeof obj === 'string' && ['trading', 'income', 'expense'].indexOf(obj) !== -1;
}
/**
 * A journal for an account.
 * @param name Name of the journal.
 * @param type Type of the journal, one of: 'trading', 'income', 'expense'.
 * @param columns Mapping of columns and their settings.
 * @param columnOrder The order of the columns show in the journal.
 * @param transactions List of transactions.
 * @returns An object with the given members.
 */
export interface Journal {
  name: string;
  type: JournalType;
  columns: JournalColumnSet;
  columnOrder: JournalColumnRole[];
  transactions: Transaction[];
}
/**
 * A set of journal columns.
 * @param date Date journal column.
 * @param base Base journal column.
 * @param baseAmount Base amount journal column.
 * @param quote Quote journal column.
 * @param quoteAmount Quote amount journal column.
 * @param price Price journal column.
 * @param feeBase Fee in base curreny journal column.
 * @param feeQuote Fee in quote curreny journal column.
 * @param notes Notes journal column.
 * @param extra Extra journal columns.
 */
export interface JournalColumnSet {
  date: DateColumn;
  base: AssetColumn;
  baseAmount: BaseAmountColumn;
  quote: AssetColumn;
  quoteAmount: QuoteAmountColumn;
  price: PriceColumn;
  feeBase: BaseAmountColumn;
  feeQuote: QuoteAmountColumn;
  notes: TextColumn;
  extra: ExtraColumn[];
}
/**
 * Used to select Columns from JournalColumnSet. A string value is for the key of a core column,
 * a number value is the index of an extra column.
 */
export type JournalColumnRole = Exclude<keyof JournalColumnSet, 'extra'> | number;
export function isJournalColumnRole(obj: any): obj is JournalColumnRole {
  const type = typeof obj;
  return type === 'number' || (type === 'string' &&
    ['date', 'base', 'baseAmount', 'quote', 'quoteAmount', 'price', 'feeBase', 'feeQuote', 'notes'].indexOf(obj) !== -1);
}
/** Base Journal Column interface to extend from. */
interface BaseJournalColumn {
  name: string;
  hide: boolean;
}
export type DateColumnFormat = 'date' | 'datetime';
export function isDateColumnFormat(obj: any): obj is DateColumnFormat {
  return typeof obj === 'string' && ['date', 'datetime'].indexOf(obj) !== -1;
}
export interface DateColumn extends BaseJournalColumn {
  type: 'date';
  format: DateColumnFormat;
}
export function isDateColumn(column: JournalColumn | BaseJournalColumn): column is DateColumn {
  return 'type' in column && column.type === 'date' && column.format !== undefined;
}
export interface AssetColumn extends BaseJournalColumn {
  type: 'asset';
}
export function isAssetColumn(column: JournalColumn | BaseJournalColumn): column is AssetColumn {
  return 'type' in column && column.type === 'asset';
}
export interface TextColumn extends BaseJournalColumn {
  type: 'text';
}
export function isTextColumn(column: JournalColumn | BaseJournalColumn): column is TextColumn {
  return 'type' in column && column.type === 'text';
}
export interface IntegerColumn extends BaseJournalColumn {
  type: 'integer';
}
export function isIntegerColumn(column: JournalColumn | BaseJournalColumn): column is IntegerColumn {
  return 'type' in column && column.type === 'integer';
}
export type DecimalColumnDescription = 'base' | 'quote' | 'price';
export function isDecimalColumnDescription(obj: any): obj is DecimalColumnDescription {
  return typeof obj === 'string' && ['base', 'quote', 'price'].indexOf(obj) !== -1;
}
/**
 * @param precision The precision shown of the column. Shows the default asset precision if not set.
 * @param description Used to set the default precision depending on if its an asset amount or price. No
 * default precision used if not set.
 */
export interface DecimalColumn extends BaseJournalColumn {
  type: 'decimal';
  // Key can be an asset ticker, e.g. USD, or an asset pair, e.g. BTC/USD.
  precision: Record<string, number>;
  // precision: Record<string, number>;
  description: DecimalColumnDescription;
}
export function isDecimalColumn(column: JournalColumn | BaseJournalColumn): column is DecimalColumn {
  return 'type' in column && column.type === 'decimal' && 'precision' in column && 'description' in column;
}
interface BaseAmountColumn extends DecimalColumn {
  description: 'base';
}
export function isBaseAmountColumn(column: JournalColumn | BaseJournalColumn): column is BaseAmountColumn {
  return isDecimalColumn(column) && column.description === 'base';
}
interface QuoteAmountColumn extends DecimalColumn {
  description: 'quote';
}
export function isQuoteAmountColumn(column: JournalColumn | BaseJournalColumn): column is QuoteAmountColumn {
  return isDecimalColumn(column) && column.description === 'quote';
}
interface PriceColumn extends DecimalColumn {
  description: 'price';
}
export function isPriceColumn(column: JournalColumn | BaseJournalColumn): column is PriceColumn {
  return isDecimalColumn(column) && column.description === 'price';
}
export interface BooleanColumn extends BaseJournalColumn {
  type: 'boolean';
}
export function isBooleanColumn(column: JournalColumn | BaseJournalColumn): column is BooleanColumn {
  return 'type' in column && column.type === 'boolean';
}
/** Journal Columns that the user can create. */
export type ExtraColumn = TextColumn | IntegerColumn | DecimalColumn | BooleanColumn;
export function isExtraColumn(column: JournalColumn | BaseJournalColumn): column is ExtraColumn {
  return isTextColumn(column) || isIntegerColumn(column) || isDecimalColumn(column) || isBooleanColumn(column);
}
export type ExtraColumnType = ExtraColumn['type'];
export function isExtraColumnType(obj: any): obj is ExtraColumnType {
  return typeof obj === 'string' && ['text', 'integer', 'decimal', 'boolean'].indexOf(obj) !== -1;
}
/** All Journal Column types */
export type JournalColumn = ExtraColumn | DateColumn | AssetColumn;
export type JournalColumnType = JournalColumn['type'];
export function isJournalColumnType(obj: any): obj is JournalColumnType {
  return typeof obj === 'string' && ['date', 'asset', 'text', 'integer', 'decimal', 'boolean'].indexOf(obj) !== -1;
}
/**
 * A transaction (trade, income or expense).\
 * An income transaction has positive base and quote amounts.\
 * An expense transaction has negative base and no quote amount.\
 * A trade has opposite base and quote amount signs.
 * @param date Date of the transaction.
 * @param base Ticker of the base currency/asset.
 * @param baseAmount Amount of base changed, i.e. amount.
 * @param quote Ticker of the quote currency/asset.
 * @param quoteAmount Amount of quote changed, i.e. total.
 * @param feeBase Fee in base currency.
 * @param feeQuote Fee in quote currency.
 * @param notes User written notes.
 * @param extra Extra properties, e.g. `{exchange: 'NYSE'}`.
 */
 export interface Transaction {
  date: string;
  base: string;
  baseAmount: number;
  quote: string;
  quoteAmount: number;
  feeBase: number;
  feeQuote: number;
  notes: string;
  extra: {[key: string]: (string | number | boolean)};
}

const defaultColumnOrder: JournalColumnRole[] = ['date', 'base', 'baseAmount', 'quote', 'quoteAmount', 'price', 'feeBase', 'feeQuote', 'notes'];
const defaultAccountSettings: AccountSettings = {
  accountingCurrency: {
    ticker: 'USD',
    name: 'United States Dollar',
    precision: 2,
    pricePrecision: 4,
    isCurrency: true,
    symbol: '$',
  },
};
const defaultAssets: Asset[] = [
  {ticker: 'BTC', name: 'Bitcoin', precision: 8, pricePrecision: 2, isCurrency: true, symbol: '₿'},
];
const defaultJournals: Journal[] = [
  createTradingJournal('Trading', undefined, [
    {
      date: '01/01/2021',
      base: 'BTC',
      baseAmount: 1,
      quote: 'USD',
      quoteAmount: 50000,
      feeBase: 0,
      feeQuote: 20,
      notes: 'First transaction',
      extra: {}
    },
    {
      date: '02/01/2021',
      base: 'BTC',
      baseAmount: 0.5,
      quote: 'USD',
      quoteAmount: 20000,
      feeBase: 0,
      feeQuote: 8,
      notes: 'Second transaction',
      extra: {}
    },
  ]),
  createExpenseJournal('Misc fees'),
];

export function createTradingColumns(dateColumnFormat: DateColumnFormat = 'date'): JournalColumnSet {
  return {
    date: {name: 'Date', format: dateColumnFormat, type: 'date', hide: false},
    base: {name: 'Asset', type: 'asset', hide: false},
    baseAmount: {name: 'Amount', type: 'decimal', description: 'base', precision: {}, hide: false},
    quote: {name: 'Quote', type: 'asset', hide: true},
    quoteAmount: {name: 'Total', type: 'decimal', description: 'quote', precision: {}, hide: false},
    price: {name: 'Price', type: 'decimal', description: 'price', precision: {}, hide: false},
    feeBase: {name: 'Fee (Base)', type: 'decimal', description: 'base', precision: {}, hide: true},
    feeQuote: {name: 'Fee', type: 'decimal', description: 'quote', precision: {}, hide: false},
    notes: {name: 'Notes', type: 'text', hide: false},
    extra: [],
  };
}

export function createIncomeColumns(dateColumnFormat: DateColumnFormat = 'date'): JournalColumnSet {
  return {
    date: {name: 'Date', format: dateColumnFormat, type: 'date', hide: false},
    base: {name: 'Asset', type: 'asset', hide: false},
    baseAmount: {name: 'Amount', type: 'decimal', description: 'base', precision: {}, hide: false},
    quote: {name: 'Quote', type: 'asset', hide: true},
    quoteAmount: {name: 'Total', type: 'decimal', description: 'quote', precision: {}, hide: false},
    price: {name: 'Price', type: 'decimal', description: 'price', precision: {}, hide: false},
    feeBase: {name: 'Fee (Base)', type: 'decimal', description: 'base', precision: {}, hide: true},
    feeQuote: {name: 'Fee', type: 'decimal', description: 'quote', precision: {}, hide: true},
    notes: {name: 'Notes', type: 'text', hide: false},
    extra: [],
  };
}

export function createExpenseColumns(dateColumnFormat: DateColumnFormat = 'date'): JournalColumnSet {
  return {
    date: {name: 'Date', format: dateColumnFormat, type: 'date', hide: false},
    base: {name: 'Asset', type: 'asset', hide: false},
    baseAmount: {name: 'Amount', type: 'decimal', description: 'base', precision: {}, hide: false},
    quote: {name: 'Quote', type: 'asset', hide: true},
    quoteAmount: {name: 'Total', type: 'decimal', description: 'quote', precision: {}, hide: false},
    price: {name: 'Price', type: 'decimal', description: 'price', precision: {}, hide: false},
    feeBase: {name: 'Fee (Base)', type: 'decimal', description: 'base', precision: {}, hide: true},
    feeQuote: {name: 'Fee', type: 'decimal', description: 'quote', precision: {}, hide: true},
    notes: {name: 'Notes', type: 'text', hide: false},
    extra: [],
  };
}

export function createDefaultJournal(name: string, type: JournalType): Journal {
  switch (type) {
    case 'trading':
      return createTradingJournal(name);
    case 'income':
      return createIncomeJournal(name);
    case 'expense':
      return createExpenseJournal(name);
  }
}

export function createTradingJournal(name: string, columnOrder: JournalColumnRole[] = defaultColumnOrder, transactions: Transaction[] = []): Journal {
  return {
    name: name,
    type: 'trading',
    columns: createTradingColumns(),
    columnOrder: columnOrder,
    transactions: transactions,
  };
}

export function createIncomeJournal(name: string, columnOrder: JournalColumnRole[] = defaultColumnOrder, transactions: Transaction[] = []): Journal {
  return {
    name: name,
    type: 'income',
    columns: createIncomeColumns(),
    columnOrder: columnOrder,
    transactions: transactions,
  };
}

export function createExpenseJournal(name: string, columnOrder: JournalColumnRole[] = defaultColumnOrder, transactions: Transaction[] = []): Journal {
  return {
    name: name,
    type: 'expense',
    columns: createExpenseColumns(),
    columnOrder: columnOrder,
    transactions: transactions,
  };
}

export function createDefaultAccount(name: string, settings = defaultAccountSettings, assets = defaultAssets, journals = defaultJournals): Account {
  return {
    name,
    settings,
    assets,
    journals,
  };
}