import { describe, expect, test } from 'vitest';
import {
  Contributor,
  ContributorRole,
  emptyContributor,
  Identity,
  VerificationStatus,
} from '../../../../../types/contributor.types';
import { Publisher } from '../../../../../types/registration.types';
import { CristinPerson } from '../../../../../types/user.types';
import {
  addSelfPublisherAsContributor,
  createPersonPublisher,
  getPublisherOptionKey,
  getSelfPublisherOption,
  isPersonPublisherOption,
  PersonPublisherOption,
  toPersonPublisherOption,
} from './publisher-field-helpers';

const loggedInUser = { name: 'Ana Bana', id: '12345' };

const personPublisherOption: PersonPublisherOption = { type: 'PersonPublisher', ...loggedInUser };

const publisher: Publisher = {
  type: 'Publisher',
  id: 'https://api.test.nva.aws.unit.no/publication-channels-v2/publisher/1234',
  identifier: '1234',
  name: 'Universitetsforlaget',
  sameAs: '',
  scientificValue: 'LevelOne',
};

const activeOrganizationId = 'https://api.test.nva.aws.unit.no/cristin/organization/1.0.0.0';

const cristinPerson = {
  id: 'https://api.test.nva.aws.unit.no/cristin/person/12345',
  names: [
    { type: 'FirstName', value: 'Ana' },
    { type: 'LastName', value: 'Bana' },
  ],
  identifiers: [{ type: 'ORCID', value: '0000-0001-2345-6789' }],
  affiliations: [
    { active: true, organization: activeOrganizationId, role: { labels: {} } },
    {
      active: false,
      organization: 'https://api.test.nva.aws.unit.no/cristin/organization/2.0.0.0',
      role: { labels: {} },
    },
  ],
  verified: true,
} as CristinPerson;

const createContributor = (role: ContributorRole, id = cristinPerson.id): Contributor => ({
  ...emptyContributor,
  identity: { type: 'Identity', id, name: 'Ana Bana' },
  role: { type: role },
  sequence: 1,
});

describe('getSelfPublisherOption', () => {
  test('offers the user when nothing is typed yet', () => {
    expect(getSelfPublisherOption('', loggedInUser)).toEqual(personPublisherOption);
  });

  test('offers the user when only whitespace is typed', () => {
    expect(getSelfPublisherOption('  ', loggedInUser)).toEqual(personPublisherOption);
  });

  test('offers the user when the query matches the start of the name', () => {
    expect(getSelfPublisherOption('an', loggedInUser)).toEqual(personPublisherOption);
  });

  test('offers the user when the query partially matches the last name', () => {
    expect(getSelfPublisherOption('ban', loggedInUser)).toEqual(personPublisherOption);
  });

  test('offers the user when the query includes letters accross names', () => {
    expect(getSelfPublisherOption('na ban', loggedInUser)).toEqual(personPublisherOption);
  });

  test('ignores casing and surrounding whitespace in the query', () => {
    expect(getSelfPublisherOption('  ANA  ', loggedInUser)).toEqual(personPublisherOption);
  });

  test('does not offer the user when the query does not match the name', () => {
    expect(getSelfPublisherOption('universitetsforlaget', loggedInUser)).toBeUndefined();
  });

  test('does not offer the user when the name is unknown', () => {
    expect(getSelfPublisherOption('', { ...loggedInUser, name: '' })).toBeUndefined();
  });

  test('does not offer the user when the person id is unknown', () => {
    expect(getSelfPublisherOption('', { ...loggedInUser, id: '' })).toBeUndefined();
  });
});

describe('isPersonPublisherOption', () => {
  test('recognizes the option representing a person', () => {
    expect(isPersonPublisherOption(personPublisherOption)).toBe(true);
  });

  test('does not recognize a publication channel', () => {
    expect(isPersonPublisherOption(publisher)).toBe(false);
  });
});

describe('getPublisherOptionKey', () => {
  test('uses the channel identifier for a publication channel', () => {
    expect(getPublisherOptionKey(publisher)).toBe('1234');
  });

  test('uses the person id for a person', () => {
    expect(getPublisherOptionKey(personPublisherOption)).toBe(loggedInUser.id);
  });
});

describe('createPersonPublisher', () => {
  test('stores the person as an identity with a personal name type', () => {
    expect(createPersonPublisher(personPublisherOption)).toEqual({
      type: 'Identity',
      id: loggedInUser.id,
      name: loggedInUser.name,
      nameType: 'Personal',
    });
  });
});

describe('toPersonPublisherOption', () => {
  test('converts a stored person publisher to an option', () => {
    const identity: Identity = { type: 'Identity', id: loggedInUser.id, name: loggedInUser.name };
    expect(toPersonPublisherOption(identity)).toEqual(personPublisherOption);
  });

  test('handles a person publisher without an id', () => {
    const identity: Identity = { type: 'Identity', name: loggedInUser.name };
    expect(toPersonPublisherOption(identity)).toEqual({ ...personPublisherOption, id: '' });
  });
});

describe('addSelfPublisherAsContributor', () => {
  test('adds the person as both author and rights holder', () => {
    const result = addSelfPublisherAsContributor(cristinPerson, []);

    expect(result.map((contributor) => contributor.role?.type)).toEqual([
      ContributorRole.Creator,
      ContributorRole.RightsHolder,
    ]);
  });

  test('registers the person with the same identity as the contributors tab gives them', () => {
    const [creator] = addSelfPublisherAsContributor(cristinPerson, []);

    expect(creator.identity).toEqual({
      type: 'Identity',
      id: cristinPerson.id,
      name: 'Ana Bana',
      orcId: 'https://orcid.org/0000-0001-2345-6789',
      verificationStatus: VerificationStatus.Verified,
    });
  });

  test('includes only the active affiliations of the person', () => {
    const [creator] = addSelfPublisherAsContributor(cristinPerson, []);

    expect(creator.affiliations).toEqual([{ type: 'Organization', id: activeOrganizationId }]);
  });

  test('numbers the added contributors after the ones already registered', () => {
    const otherPerson = createContributor(ContributorRole.Editor, 'https://example.org/person/999');
    const result = addSelfPublisherAsContributor(cristinPerson, [otherPerson]);

    expect(result.map((contributor) => contributor.sequence)).toEqual([1, 2, 3]);
  });

  test('does not add a role the person already has', () => {
    const result = addSelfPublisherAsContributor(cristinPerson, [createContributor(ContributorRole.Creator)]);

    expect(result).toHaveLength(2);
    expect(result[1].role?.type).toBe(ContributorRole.RightsHolder);
  });

  test('adds nothing when the person already has both roles', () => {
    const contributors = [createContributor(ContributorRole.Creator), createContributor(ContributorRole.RightsHolder)];

    expect(addSelfPublisherAsContributor(cristinPerson, contributors)).toEqual(contributors);
  });

  test('keeps the roles another person already has', () => {
    const otherPerson = createContributor(ContributorRole.Creator, '999');
    const result = addSelfPublisherAsContributor(cristinPerson, [otherPerson]);

    expect(result).toHaveLength(3);
    expect(result[0].identity.id).toBe(otherPerson.identity.id);
  });
});
