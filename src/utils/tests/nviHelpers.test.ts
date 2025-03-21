import { describe, expect, test } from 'vitest';
import { BookRegistration } from '../../types/publication_types/bookRegistration.types';
import { JournalType, PublicationType } from '../../types/publicationFieldNames';
import { PublicationChannelType } from '../../types/registration.types';
import { willResetNviStatuses } from '../nviHelpers';
import { mockRegistration } from '../testfiles/mockRegistration';

const nviRegistration = structuredClone(mockRegistration);

describe('willResetNviStatuses()', () => {
  test('Returns false when existing result could not be an NVI candidate', async () => {
    let nonNviRegistration = structuredClone(nviRegistration);
    nonNviRegistration.entityDescription.reference!.publicationInstance.type = JournalType.Review;

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

  test('Returns true when journal or publisher is changed', async () => {
    const channelId1 = 'https://api.com/channel/1';
    const channelId2 = 'https://api.com/channel/2';

    let persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.reference!.publicationContext.id = channelId1;

    let updatedRegistration = structuredClone(persistedRegistration);
    updatedRegistration.entityDescription.reference!.publicationContext.id = channelId2;

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns true when series is changed', async () => {
    const seriesId1 = 'https://api.com/channel/1';
    const seriesId2 = 'https://api.com/channel/2';

    let persistedRegistration = structuredClone(nviRegistration) as BookRegistration;
    persistedRegistration.entityDescription.reference!.publicationContext = {
      type: PublicationType.Book,
      isbnList: [],
      seriesNumber: '',
      series: {
        type: PublicationChannelType.Series,
        id: seriesId1,
      },
    };

    let updatedRegistration = structuredClone(persistedRegistration) as BookRegistration;
    updatedRegistration.entityDescription.reference!.publicationContext.series!.id = seriesId2;

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns true when a new institution is added as affiliation', async () => {
    //   const persistedAffiliations: Affiliation[] = [{ type: 'Organization', id: 'https://api.com/organization/1' }];
    //   const persistedContributors: Contributor[] = [
    //     {
    //       type: 'Contributor',
    //       affiliations: persistedAffiliations,
    //       correspondingAuthor: false,
    //       identity: {
    //         type: 'Identity',
    //         name: 'Name Nameson',
    //       },
    //       role: { type: ContributorRole.Creator },
    //       sequence: 1,
    //     },
    //   ];
    //   let persistedRegistration = structuredClone(nviRegistration);
    //   persistedRegistration.entityDescription.contributors = persistedContributors;
    //   let updatedRegistration = structuredClone(persistedRegistration);
    //   const newAffiliation: Affiliation = { type: 'Organization', id: 'https://api.com/organization/2' };
    //   updatedRegistration.entityDescription.contributors[0].affiliations = [...persistedAffiliations, newAffiliation];
    //   const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    //   expect(result).toBe(true);
  });

  test('Returns true when an affiliation is changed to another institution', async () => {
    // TODO
    // const persistedAffiliations: Affiliation[] = [{ type: 'Organization', id: 'https://api.com/institution/1' }];
    // const persistedContributors: Contributor[] = [
    //   {
    //     type: 'Contributor',
    //     affiliations: persistedAffiliations,
    //     correspondingAuthor: false,
    //     identity: {
    //       type: 'Identity',
    //       name: 'Name Nameson',
    //     },
    //     role: { type: ContributorRole.Creator },
    //     sequence: 1,
    //   },
    // ];
    // let persistedRegistration = structuredClone(nviRegistration);
    // persistedRegistration.entityDescription.contributors = persistedContributors;
    // let updatedRegistration = structuredClone(persistedRegistration);
    // const newAffiliation: Affiliation = { type: 'Organization', id: 'https://api.com/institution/1' };
    // updatedRegistration.entityDescription.contributors[0].affiliations = [newAffiliation];
    // const result = await willResetNviStatuses(nviRegistration, updatedRegistration);
    // expect(result).toBe(true);
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
