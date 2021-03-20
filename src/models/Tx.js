export default class Tx {
  /**
   * Constructor for the Tx (Transaction) class.
   * @param {String} date Date/time of the transaction.
   * @param {String} quote Quote currency/asset.
   * @param {String} base Base currency/asset.
   * @param {Boolean} buy true if buy, false if sell.
   * @param {Number} baseAmount Amount bought/sold.
   * @param {Number} quoteAmount Amount paid/received.
   * @param {Number} feeBase Fees in the base currency.
   * @param {Number} feeQuote Fees in the quote currency.
   * @param {String} notes User written notes.
   * @param {Array} misc Extra properties, e.g. [{name: 'Exchange', value: 'NYSE'}].
   */
  constructor(
    date,
    quote,
    base,
    buy,
    baseAmount,
    quoteAmount,
    feeBase = 0,
    feeQuote = 0,
    notes = '',
    misc = []
  ) {
    this.date = date;
    this.quote = quote;
    this.base = base;
    this.buy = buy;
    this.baseAmount = baseAmount;
    this.quoteAmount = quoteAmount;
    this.feeBase = feeBase;
    this.feeQuote = feeQuote;
    this.notes = notes;
    this.misc = misc;
  }
}