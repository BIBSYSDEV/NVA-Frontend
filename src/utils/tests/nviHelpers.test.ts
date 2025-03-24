import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { Affiliation, Contributor, ContributorRole } from '../../types/contributor.types';
import { Organization } from '../../types/organization.types';
import { BookRegistration } from '../../types/publication_types/bookRegistration.types';
import { JournalType, PublicationType } from '../../types/publicationFieldNames';
import { PublicationChannelType } from '../../types/registration.types';
import { willResetNviStatuses } from '../nviHelpers';
import { mockRegistration } from '../testfiles/mockRegistration';

const nviRegistration = structuredClone(mockRegistration);

const institutionA: Organization = {
  type: 'Organization',
  id: 'https://api.com/organization/1.0',
  labels: { en: 'Institution A' },
};

const subunitOnInstitutionA: Organization = {
  type: 'Organization',
  id: 'https://api.com/organization/1.1',
  labels: { en: 'Subunit on institution A' },
  partOf: [institutionA],
};

const institutionB: Organization = {
  type: 'Organization',
  id: 'https://api.com/organization/2.0',
  labels: { en: 'Institution B' },
};

const restHandlers = [
  http.get(institutionA.id, () => {
    return HttpResponse.json(institutionA);
  }),
  http.get(subunitOnInstitutionA.id, () => {
    return HttpResponse.json(subunitOnInstitutionA);
  }),
  http.get(institutionB.id, () => {
    return HttpResponse.json(institutionB);
  }),
];

const server = setupServer(...restHandlers);

describe('willResetNviStatuses()', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterAll(() => {
    server.close();
  });

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
    const persistedAffiliations: Affiliation[] = [{ type: 'Organization', id: institutionA.id }];
    const persistedContributors: Contributor[] = [
      {
        type: 'Contributor',
        affiliations: persistedAffiliations,
        correspondingAuthor: false,
        identity: {
          type: 'Identity',
          name: 'Oste Loff',
        },
        role: { type: ContributorRole.Creator },
        sequence: 1,
      },
    ];
    let persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.contributors = persistedContributors;

    let updatedRegistration = structuredClone(persistedRegistration);
    const newInstitutionAffiliation: Affiliation = { type: 'Organization', id: institutionB.id };
    updatedRegistration.entityDescription.contributors[0].affiliations = [
      ...persistedAffiliations,
      newInstitutionAffiliation,
    ];

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns false when a new unit of an institution they already has as affiliation is added', async () => {
    const persistedAffiliations: Affiliation[] = [{ type: 'Organization', id: institutionA.id }];
    const persistedContributors: Contributor[] = [
      {
        type: 'Contributor',
        affiliations: persistedAffiliations,
        correspondingAuthor: false,
        identity: {
          type: 'Identity',
          name: 'Oste Loff',
        },
        role: { type: ContributorRole.Creator },
        sequence: 1,
      },
    ];
    let persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.contributors = persistedContributors;

    let updatedRegistration = structuredClone(persistedRegistration);
    updatedRegistration.entityDescription.contributors[0].affiliations = [
      ...persistedAffiliations,
      { type: 'Organization', id: subunitOnInstitutionA.id },
    ];

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(false);
  });

  test('Returns true when an affiliation is changed to another institution', async () => {
    const persistedContributors: Contributor[] = [
      {
        type: 'Contributor',
        affiliations: [{ type: 'Organization', id: institutionA.id }],
        correspondingAuthor: false,
        identity: {
          type: 'Identity',
          name: 'Name Nameson',
        },
        role: { type: ContributorRole.Creator },
        sequence: 1,
      },
    ];
    let persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.contributors = persistedContributors;

    let updatedRegistration = structuredClone(persistedRegistration);
    updatedRegistration.entityDescription.contributors[0].affiliations = [
      { type: 'Organization', id: institutionB.id },
    ];

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns false when an affiliation is changed to another unit on the same institution', async () => {
    const persistedContributors: Contributor[] = [
      {
        type: 'Contributor',
        affiliations: [{ type: 'Organization', id: institutionA.id }],
        correspondingAuthor: false,
        identity: {
          type: 'Identity',
          name: 'Name Nameson',
        },
        role: { type: ContributorRole.Creator },
        sequence: 1,
      },
    ];
    let persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.contributors = persistedContributors;

    let updatedRegistration = structuredClone(persistedRegistration);
    updatedRegistration.entityDescription.contributors[0].affiliations = [
      { type: 'Organization', id: subunitOnInstitutionA.id },
    ];

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(false);
  });

  test('Returns true when an affiliation is removed', async () => {
    const persistedContributors: Contributor[] = [
      {
        type: 'Contributor',
        affiliations: [{ type: 'Organization', id: institutionA.id }],
        correspondingAuthor: false,
        identity: {
          type: 'Identity',
          name: 'Name Nameson',
        },
        role: { type: ContributorRole.Creator },
        sequence: 1,
      },
    ];
    let persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.contributors = persistedContributors;

    let updatedRegistration = structuredClone(persistedRegistration);
    updatedRegistration.entityDescription.contributors[0].affiliations = [];

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns true when a new contributor is added without any affiliations', async () => {
    const persistedContributor: Contributor = {
      type: 'Contributor',
      affiliations: [{ type: 'Organization', id: institutionA.id }],
      correspondingAuthor: false,
      identity: {
        type: 'Identity',
        name: 'Name Nameson',
      },
      role: { type: ContributorRole.Creator },
      sequence: 1,
    };

    let persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.contributors = [persistedContributor];

    const newContributor: Contributor = {
      type: 'Contributor',
      affiliations: [],
      correspondingAuthor: false,
      identity: {
        type: 'Identity',
        name: 'Name Nameson',
      },
      role: { type: ContributorRole.Creator },
      sequence: 1,
    };
    let updatedRegistration = structuredClone(persistedRegistration);
    updatedRegistration.entityDescription.contributors = [persistedContributor, newContributor];

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });
});
