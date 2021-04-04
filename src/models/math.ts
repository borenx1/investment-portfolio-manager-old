function decimalFactor(precision?: number): number {
  if (precision === undefined || isNaN(precision) || precision < 0) {
    return NaN;
  }
  return Math.pow(10, Math.trunc(precision));
}

export function roundDown(value: number, precision?: number): number {
  const factor = decimalFactor(precision)
  if (isNaN(factor)) {
    return value;
  }
  return Math.floor(value * factor) / factor;
}

export function multiply(n1: number, n2: number, precision?: number) {
  return roundDown(n1 * n2, precision);
}

export function divide(dividend: number, divisor: number, precision?: number) {
  return roundDown(dividend / divisor, precision);
}