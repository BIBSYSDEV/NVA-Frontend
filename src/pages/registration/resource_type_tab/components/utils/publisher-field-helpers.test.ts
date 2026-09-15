import { describe, expect, test } from 'vitest';
import { Identity } from '../../../../../types/contributor.types';
import { Publisher } from '../../../../../types/registration.types';
import {
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
