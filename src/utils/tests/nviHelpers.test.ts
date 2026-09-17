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
import { buildContributor, buildIdentity } from './testHelpers';

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
  http.get(institutionA.id, () => HttpResponse.json(institutionA)),
  http.get(subunitOnInstitutionA.id, () => HttpResponse.json(subunitOnInstitutionA)),
  http.get(institutionB.id, () => HttpResponse.json(institutionB)),
];

const server = setupServer(...restHandlers);

const personId = 'https://api.com/person/1';
const otherPersonId = 'https://api.com/person/2';

const affiliationA: Affiliation = { type: 'Organization', id: institutionA.id };
const affiliationSubunitA: Affiliation = { type: 'Organization', id: subunitOnInstitutionA.id };
const affiliationB: Affiliation = { type: 'Organization', id: institutionB.id };

const buildNviRegistration = (contributors: Contributor[]) => {
  const registration = structuredClone(nviRegistration);
  registration.entityDescription.contributors = contributors;
  return registration;
};

describe('willResetNviStatuses()', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterAll(() => {
    server.close();
  });

  test('Returns false when existing result could not be an NVI candidate', async () => {
    const nonNviRegistration = structuredClone(nviRegistration);
    nonNviRegistration.entityDescription.reference!.publicationInstance.type = JournalType.Review;

    const result = await willResetNviStatuses(nonNviRegistration, nviRegistration);
    expect(result).toBe(false);
  });

  test('Returns true when year is changed', async () => {
    const persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.publicationDate!.year = '2000';

    const updatedRegistration = structuredClone(persistedRegistration);
    updatedRegistration.entityDescription.publicationDate!.year = '2001';

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns false when date is changed within same year', async () => {
    const persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.publicationDate!.day = '1';
    persistedRegistration.entityDescription.publicationDate!.month = '1';
    persistedRegistration.entityDescription.publicationDate!.year = '2000';

    const updatedRegistration = structuredClone(nviRegistration);
    updatedRegistration.entityDescription.publicationDate!.day = '2';
    updatedRegistration.entityDescription.publicationDate!.month = '2';
    updatedRegistration.entityDescription.publicationDate!.year = '2000';

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(false);
  });

  test('Returns true when category is changed', async () => {
    const updatedRegistration = structuredClone(nviRegistration);
    updatedRegistration.entityDescription.reference!.publicationInstance.type = JournalType.AcademicLiteratureReview;

    const result = await willResetNviStatuses(nviRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns true when journal or publisher is changed', async () => {
    const channelId1 = 'https://api.com/channel/1';
    const channelId2 = 'https://api.com/channel/2';

    const persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.reference!.publicationContext.id = channelId1;

    const updatedRegistration = structuredClone(persistedRegistration);
    updatedRegistration.entityDescription.reference!.publicationContext.id = channelId2;

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns true when series is changed', async () => {
    const seriesId1 = 'https://api.com/channel/1';
    const seriesId2 = 'https://api.com/channel/2';

    const persistedRegistration = structuredClone(nviRegistration) as BookRegistration;
    persistedRegistration.entityDescription.reference!.publicationContext = {
      type: PublicationType.Book,
      isbnList: [],
      seriesNumber: '',
      series: {
        type: PublicationChannelType.Series,
        id: seriesId1,
      },
    };

    const updatedRegistration = structuredClone(persistedRegistration) as BookRegistration;
    updatedRegistration.entityDescription.reference!.publicationContext.series!.id = seriesId2;

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns true when a new institution is added as affiliation', async () => {
    const persistedAffiliations: Affiliation[] = [{ type: 'Organization', id: institutionA.id }];
    const persistedContributor: Contributor = {
      type: 'Contributor',
      affiliations: persistedAffiliations,
      correspondingAuthor: false,
      identity: {
        type: 'Identity',
        name: 'Oste Loff',
      },
      role: { type: ContributorRole.Creator },
      sequence: 1,
    };
    const persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.contributors = [persistedContributor];

    const updatedRegistration = structuredClone(persistedRegistration);
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
    const persistedContributor: Contributor = {
      type: 'Contributor',
      affiliations: persistedAffiliations,
      correspondingAuthor: false,
      identity: {
        type: 'Identity',
        name: 'Oste Loff',
      },
      role: { type: ContributorRole.Creator },
      sequence: 1,
    };
    const persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.contributors = [persistedContributor];

    const updatedRegistration = structuredClone(persistedRegistration);
    updatedRegistration.entityDescription.contributors[0].affiliations = [
      ...persistedAffiliations,
      { type: 'Organization', id: subunitOnInstitutionA.id },
    ];

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(false);
  });

  test('Returns true when an affiliation is changed to another institution', async () => {
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
    const persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.contributors = [persistedContributor];

    const updatedRegistration = structuredClone(persistedRegistration);
    updatedRegistration.entityDescription.contributors[0].affiliations = [
      { type: 'Organization', id: institutionB.id },
    ];

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns false when an affiliation is changed to another unit on the same institution', async () => {
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
    const persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.contributors = [persistedContributor];

    const updatedRegistration = structuredClone(persistedRegistration);
    updatedRegistration.entityDescription.contributors[0].affiliations = [
      { type: 'Organization', id: subunitOnInstitutionA.id },
    ];

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(false);
  });

  test('Returns true when an affiliation is removed', async () => {
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

    const persistedRegistration = structuredClone(nviRegistration);
    persistedRegistration.entityDescription.contributors = [persistedContributor];

    const updatedRegistration = structuredClone(persistedRegistration);
    updatedRegistration.entityDescription.contributors[0].affiliations = [];

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns true when an affiliation is changed on one of several roles of the same person', async () => {
    const creator = buildContributor({
      identity: buildIdentity({ id: personId, name: 'Name Nameson' }),
      role: { type: ContributorRole.Creator },
      affiliations: [affiliationA],
      sequence: 1,
    });
    const editor = buildContributor({
      identity: buildIdentity({ id: personId, name: 'Name Nameson' }),
      role: { type: ContributorRole.Editor },
      affiliations: [affiliationA],
      sequence: 2,
    });

    const persistedRegistration = buildNviRegistration([creator, editor]);
    const updatedRegistration = buildNviRegistration([creator, { ...editor, affiliations: [affiliationB] }]);

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns false when one of several roles of the same person is moved to another unit on the same institution', async () => {
    const creator = buildContributor({
      identity: buildIdentity({ id: personId, name: 'Name Nameson' }),
      role: { type: ContributorRole.Creator },
      affiliations: [affiliationA],
      sequence: 1,
    });
    const editor = buildContributor({
      identity: buildIdentity({ id: personId, name: 'Name Nameson' }),
      role: { type: ContributorRole.Editor },
      affiliations: [affiliationA],
      sequence: 2,
    });

    const persistedRegistration = buildNviRegistration([creator, editor]);
    const updatedRegistration = buildNviRegistration([creator, { ...editor, affiliations: [affiliationSubunitA] }]);

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(false);
  });

  test('Returns false when a person has several roles and nothing is changed', async () => {
    const creator = buildContributor({
      identity: buildIdentity({ id: personId, name: 'Name Nameson' }),
      role: { type: ContributorRole.Creator },
      affiliations: [affiliationA],
      sequence: 1,
    });
    const editor = buildContributor({
      identity: buildIdentity({ id: personId, name: 'Name Nameson' }),
      role: { type: ContributorRole.Editor },
      affiliations: [affiliationA],
      sequence: 2,
    });

    const persistedRegistration = buildNviRegistration([creator, editor]);
    const updatedRegistration = buildNviRegistration([creator, editor]);

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(false);
  });

  test('Returns true when the role of a contributor is changed', async () => {
    const creator = buildContributor({
      identity: buildIdentity({ id: personId, name: 'Name Nameson' }),
      role: { type: ContributorRole.Creator },
      affiliations: [affiliationA],
    });

    const persistedRegistration = buildNviRegistration([creator]);
    const updatedRegistration = buildNviRegistration([{ ...creator, role: { type: ContributorRole.ContactPerson } }]);

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns true when a role is added to a person who is already a contributor', async () => {
    const creator = buildContributor({
      identity: buildIdentity({ id: personId, name: 'Name Nameson' }),
      role: { type: ContributorRole.Creator },
      affiliations: [affiliationA],
      sequence: 1,
    });

    const persistedRegistration = buildNviRegistration([creator]);
    const updatedRegistration = buildNviRegistration([
      creator,
      { ...creator, role: { type: ContributorRole.ContactPerson }, sequence: 2 },
    ]);

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns false when the contributors are reordered', async () => {
    const firstContributor = buildContributor({
      identity: buildIdentity({ id: personId, name: 'Name Nameson' }),
      affiliations: [affiliationA],
      sequence: 1,
    });
    const secondContributor = buildContributor({
      identity: buildIdentity({ id: otherPersonId, name: 'Other Person' }),
      affiliations: [affiliationB],
      sequence: 2,
    });

    const persistedRegistration = buildNviRegistration([firstContributor, secondContributor]);
    const updatedRegistration = buildNviRegistration([
      { ...secondContributor, sequence: 1 },
      { ...firstContributor, sequence: 2 },
    ]);

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(false);
  });

  test('Returns false when an identified contributor is renamed', async () => {
    const contributor = buildContributor({
      identity: buildIdentity({ id: personId, name: 'Old Name' }),
      affiliations: [affiliationA],
    });

    const persistedRegistration = buildNviRegistration([contributor]);
    const updatedRegistration = buildNviRegistration([
      { ...contributor, identity: buildIdentity({ id: personId, name: 'New Name' }) },
    ]);

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(false);
  });

  test('Returns true when an unidentified contributor is renamed', async () => {
    const contributor = buildContributor({
      identity: buildIdentity({ name: 'Old Name' }),
      affiliations: [affiliationA],
    });

    const persistedRegistration = buildNviRegistration([contributor]);
    const updatedRegistration = buildNviRegistration([
      { ...contributor, identity: buildIdentity({ name: 'New Name' }) },
    ]);

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns true when an affiliation is changed on one of several unidentified contributors', async () => {
    const firstContributor = buildContributor({
      identity: buildIdentity({ name: 'First Unidentified' }),
      affiliations: [affiliationA],
      sequence: 1,
    });
    const secondContributor = buildContributor({
      identity: buildIdentity({ name: 'Second Unidentified' }),
      affiliations: [affiliationA],
      sequence: 2,
    });

    const persistedRegistration = buildNviRegistration([firstContributor, secondContributor]);
    const updatedRegistration = buildNviRegistration([
      firstContributor,
      { ...secondContributor, affiliations: [affiliationB] },
    ]);

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });

  test('Returns true when a new contributor is added with the same name as an existing one', async () => {
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

    const persistedRegistration = structuredClone(nviRegistration);
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
    const updatedRegistration = structuredClone(persistedRegistration);
    updatedRegistration.entityDescription.contributors = [persistedContributor, newContributor];

    const result = await willResetNviStatuses(persistedRegistration, updatedRegistration);
    expect(result).toBe(true);
  });
});
