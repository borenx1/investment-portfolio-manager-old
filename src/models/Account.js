import { Tx, TransactionColumn } from './Tx';

const defaultAccountSettings = {
  baseCurrency: 'USD',
};
const defaultAssets = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    precision: 8,
    pricePrecision: 2,
  },
];
const defaultTxTypes = [
  {
    name: 'Trading',
    transactions: [],
    columns: {
      date: new TransactionColumn('Date', Date, 0),
      base: new TransactionColumn('Asset', String, 1),
      trade: new TransactionColumn('Trade', String, 2),
      baseAmount: new TransactionColumn('Amount', String, 3),
      quote: new TransactionColumn('Quote', String, 4, true),
      quoteAmount: new TransactionColumn('Total', String, 5),
      price: new TransactionColumn('Price', String, 6),
      feeBase: new TransactionColumn('Fee (Base)', String, 7, true),
      feeQuote: new TransactionColumn('Fee', String, 8),
      notes: new TransactionColumn('Notes', String, 9),
      extra: [],
    },
  },
  {
    name: 'Misc fees',
    transactions: [],
    columns: {
      date: new TransactionColumn('Date', Date, 0),
      base: new TransactionColumn('Asset', String, 1),
      trade: new TransactionColumn('Trade', String, 2),
      baseAmount: new TransactionColumn('Amount', String, 3),
      quote: new TransactionColumn('Quote', String, 4, true),
      quoteAmount: new TransactionColumn('Total', String, 5),
      price: new TransactionColumn('Price', String, 6),
      feeBase: new TransactionColumn('Fee (Base)', String, 7, true),
      feeQuote: new TransactionColumn('Fee', String, 8, true),
      notes: new TransactionColumn('Notes', String, 9),
      extra: [],
    },
  },
];

export class Account {
  constructor(
    name,
    settings = defaultAccountSettings,
    assets = defaultAssets,
    txTypes = defaultTxTypes,
  ) {
    this.name = name;
    this.settings = settings;
    this.assets = assets;
    this.txTypes = txTypes;
  }
}

export default Account;