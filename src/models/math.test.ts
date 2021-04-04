import { roundDown } from "./math";

describe('roundDown', () => {
  test('expected', () => {
    expect(roundDown(1, 1).toNumber()).toEqual(1);
    expect(roundDown(1.9, 0).toNumber()).toEqual(1);
    expect(roundDown(10.123, 1).toNumber()).toEqual(10.1);
    expect(roundDown(11.14, 3).toNumber()).toEqual(11.14);
    expect(roundDown(0.1234, 4).toNumber()).toEqual(0.1234);
  });
  test('invalid decimal', () => {
    expect(roundDown(1.123, -1).toNumber()).toEqual(1.123);
    expect(roundDown(0.123456, NaN).toNumber()).toEqual(0.123456);
  });
});