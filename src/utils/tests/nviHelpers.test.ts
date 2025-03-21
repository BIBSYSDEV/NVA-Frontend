import { describe, expect, test } from 'vitest';
import { JournalType } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { willResetNviStatuses } from '../nviHelpers';
import { mockRegistration } from '../testfiles/mockRegistration';

const nviRegistration = structuredClone(mockRegistration);

const nonNviRegistration: Registration = {
  ...mockRegistration,
  entityDescription: {
    ...mockRegistration.entityDescription,
    reference: {
      ...mockRegistration.entityDescription.reference,
      publicationInstance: {
        ...mockRegistration.entityDescription.reference?.publicationInstance,
        type: JournalType.Review,
      },
    },
  },
};

describe.only('willResetNviStatuses()', () => {
  test('Returns false when existing result could not be an NVI candidate', async () => {
    const result = await willResetNviStatuses(nonNviRegistration, nviRegistration);
    expect(result).toBe(false);
  });

  test('Returns true when year is changed', async () => {
    let persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.publicationDate!.year = '2000';

    let updatedRegistration = structuredClone(persistedRegistration);
    updatedRegistration.entityDescription.publicationDate!.year = '2001';

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns false when date is changed within same year', async () => {
    let persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.publicationDate!.day = '1';
    persistedRegistration.entityDescription.publicationDate!.month = '1';
    persistedRegistration.entityDescription.publicationDate!.year = '2000';

    let updatedRegistration = structuredClone(nviRegistration);
    updatedRegistration.entityDescription.publicationDate!.day = '2';
    updatedRegistration.entityDescription.publicationDate!.month = '2';
    updatedRegistration.entityDescription.publicationDate!.year = '2000';

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(false);
  });

  test('Returns true when category is changed', async () => {
    let updatedRegistration = structuredClone(nviRegistration);
    updatedRegistration.entityDescription.reference!.publicationInstance.type = JournalType.AcademicLiteratureReview;

    const result = await willResetNviStatuses(nviRegistration, updatedRegistration);
    expect(result).toBe(true);
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
