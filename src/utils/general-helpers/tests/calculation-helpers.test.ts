import { describe, expect, it } from 'vitest';
import { percentageOfAComparedToB } from '../calculation-helpers';

describe('percentageOfAComparedToB', () => {
  it('returns correct rounded percentage', () => {
    expect(percentageOfAComparedToB(1, 4)).toBe(25);
    expect(percentageOfAComparedToB(1, 3)).toBe(33);
  });

  it('returns 100 when a equals b', () => {
    expect(percentageOfAComparedToB(5, 5)).toBe(100);
  });

  it('returns undefined when b is 0', () => {
    expect(percentageOfAComparedToB(5, 0)).toBeUndefined();
  });

  it('returns undefined when a is undefined', () => {
    expect(percentageOfAComparedToB(undefined, 5)).toBeUndefined();
  });

  it('returns undefined when b is undefined', () => {
    expect(percentageOfAComparedToB(5, undefined)).toBeUndefined();
  });

  it('returns undefined when both are undefined', () => {
    expect(percentageOfAComparedToB(undefined, undefined)).toBeUndefined();
  });
});
