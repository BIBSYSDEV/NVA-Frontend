import { describe, test } from 'vitest';

describe('willResetNviStatuses()', () => {
  test('Returns false when result cannot be an NVI candidate', () => {
    // TODO
  });

  test('Returns true when year is changed', () => {
    // TODO
  });

  test('Returns false when date is changed within same year', () => {
    // TODO
  });

  test('Returns true when category is changed', () => {
    // TODO
  });

  test('Returns true when journal or publisher is changed', () => {
    // TODO
  });

  test('Returns true when series is changed', () => {
    // TODO
  });

  test('Returns true when a new institution is added as affiliation', () => {
    // TODO
  });

  test('Returns false when a new unit of an institution they already has as affiliation is added', () => {
    // TODO
  });

  test('Returns false when an affiliation is changed to another unit in the same institution', () => {
    // TODO
  });

  test('Returns false when a new contributor is added without any affiliations', () => {
    // TODO
  });

  test('Returns true when a new contributor is added with an affiliation', () => {
    // TODO
  });
});
