import BigNumber from "bignumber.js";

/**
 * Rounds down a number to the given decimal places. Returns the original number if decimals is not given or NaN.
 * @param value The number to round down.
 * @param decimals The number of decimal places to round down to.
 */
export function roundDown(value: BigNumber.Value, decimals?: number): BigNumber {
  if (decimals === undefined || isNaN(decimals) || decimals < 0) {
    return new BigNumber(value);
  }
  return new BigNumber(value).decimalPlaces(decimals, BigNumber.ROUND_DOWN);
}