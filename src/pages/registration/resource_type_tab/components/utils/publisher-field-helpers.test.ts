import { describe, expect, test } from 'vitest';
import { Publisher } from '../../../../../types/registration.types';
import {
  getPublisherOptionKey,
  getSelfPublisherOption,
  isSelfPublisher,
  SelfPublisher,
} from './publisher-field-helpers';

const loggedInUser = { name: 'Ana Bana', personId: '12345' };

const selfPublisher: SelfPublisher = { type: 'SelfPublisher', ...loggedInUser };

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
    expect(getSelfPublisherOption('', loggedInUser)).toEqual(selfPublisher);
  });

  test('offers the user when only whitespace is typed', () => {
    expect(getSelfPublisherOption('  ', loggedInUser)).toEqual(selfPublisher);
  });

  test('offers the user when the query matches the start of the name', () => {
    expect(getSelfPublisherOption('an', loggedInUser)).toEqual(selfPublisher);
  });

  test('offers the user when the query matches the last name', () => {
    expect(getSelfPublisherOption('ban', loggedInUser)).toEqual(selfPublisher);
  });

  test('offers the user when the query matches the full name across the space', () => {
    expect(getSelfPublisherOption('na ban', loggedInUser)).toEqual(selfPublisher);
  });

  test('ignores casing and surrounding whitespace in the query', () => {
    expect(getSelfPublisherOption('  ANA  ', loggedInUser)).toEqual(selfPublisher);
  });

  test('does not offer the user when the query does not match the name', () => {
    expect(getSelfPublisherOption('universitetsforlaget', loggedInUser)).toBeUndefined();
  });

  test('does not offer the user when the name is unknown', () => {
    expect(getSelfPublisherOption('', { name: '', personId: '12345' })).toBeUndefined();
  });
});

describe('isSelfPublisher', () => {
  test('recognizes the option representing the logged-in user', () => {
    expect(isSelfPublisher(selfPublisher)).toBe(true);
  });

  test('does not recognize a publication channel', () => {
    expect(isSelfPublisher(publisher)).toBe(false);
  });
});

describe('getPublisherOptionKey', () => {
  test('uses the channel identifier for a publication channel', () => {
    expect(getPublisherOptionKey(publisher)).toBe('1234');
  });

  test('uses the option type for the logged-in user', () => {
    expect(getPublisherOptionKey(selfPublisher)).toBe('SelfPublisher');
  });
});
