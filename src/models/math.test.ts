import { roundDown } from "./math";

describe('roundDown', () => {
  test('expected', () => {
    expect(roundDown(1, 1)).toEqual(1);
    expect(roundDown(1.9, 0)).toEqual(1);
    expect(roundDown(10.123, 1)).toEqual(10.1);
    expect(roundDown(11.14, 3)).toEqual(11.14);
    expect(roundDown(0.1234, 4)).toEqual(0.1234);
  });
  test('invalid decimal', () => {
    expect(roundDown(1.123, -1)).toEqual(1.123);
    expect(roundDown(0.123456, NaN)).toEqual(0.123456);
  });
});