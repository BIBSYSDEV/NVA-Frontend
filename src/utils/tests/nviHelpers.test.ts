import { describe, expect, test } from 'vitest';
import { JournalType } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { willResetNviStatuses } from '../nviHelpers';
import { mockRegistration } from '../testfiles/mockRegistration';

const nviRegistration = {
  ...mockRegistration,
} satisfies Registration;

const nonNviRegistration = {
  ...mockRegistration,
  entityDescription: {
    ...mockRegistration.entityDescription,
    reference: {
      ...mockRegistration.entityDescription.reference,
      publicationInstance: {
        ...mockRegistration.entityDescription.reference.publicationInstance,
        type: JournalType.Review,
      },
    },
  },
} satisfies Registration;

describe.only('willResetNviStatuses()', () => {
  test('Returns false when existing result could not be an NVI candidate', async () => {
    const result = await willResetNviStatuses(nonNviRegistration, nviRegistration);
    expect(result).toBe(false);
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

  test('Returns true when an affiliation is changed to another institution', () => {
    // TODO
  });

  test('Returns true when an affiliation is removed', () => {
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
