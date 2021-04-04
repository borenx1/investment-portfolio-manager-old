function decimalFactor(decimals: number): number {
  if (decimals < 0 || isNaN(decimals)) {
    return NaN;
  }
  return Math.pow(10, Math.trunc(decimals));
}

export function roundDown(value: number, decimals: number): number {
  const factor = decimalFactor(decimals)
  if (isNaN(factor)) {
    return value;
  }
  return Math.floor(value * factor) / factor;
}

export function multiply(n1: number, n2: number, decimals: number) {
  return roundDown(n1 * n2, decimals);
}