import { describe, expect, it } from 'vitest';
import { Contributor } from '../../../../../../types/contributor.types';
import { formatAuthorList } from './citation-helpers';

const buildContributors = (count: number): Contributor[] =>
  Array.from(
    { length: count },
    (_, index) =>
      ({
        type: 'Contributor',
        identity: { type: 'Identity', name: `Author${index + 1}` },
        sequence: index + 1,
      }) as unknown as Contributor
  );

const join19 = Array.from({ length: 19 }, (_, index) => `Author${index + 1}`).join(', ');

describe('formatAuthorList', () => {
  it('Renders a single author as-is', () => {
    expect(formatAuthorList(buildContributors(1))).toBe('Author1');
  });

  it('Joins two authors with an ampersand', () => {
    expect(formatAuthorList(buildContributors(2))).toBe('Author1, & Author2');
  });

  it('Lists all 19 authors with an ampersand before the last', () => {
    expect(formatAuthorList(buildContributors(19))).toBe(
      'Author1, Author2, Author3, Author4, Author5, Author6, Author7, Author8, Author9, Author10, Author11, Author12, Author13, Author14, Author15, Author16, Author17, Author18, & Author19'
    );
  });

  it('Lists all 20 authors with an ampersand before the last', () => {
    expect(formatAuthorList(buildContributors(20))).toBe(`${join19}, & Author20`);
  });

  it('Truncates 21 authors with the APA 7 ellipsis rule', () => {
    expect(formatAuthorList(buildContributors(21))).toBe(`${join19}, ... Author21`);
  });

  it('Truncates 25 authors with the APA 7 ellipsis rule', () => {
    expect(formatAuthorList(buildContributors(25))).toBe(`${join19}, ... Author25`);
  });
});
