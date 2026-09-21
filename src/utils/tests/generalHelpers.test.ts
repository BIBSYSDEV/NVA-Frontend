import { describe, expect, it } from 'vitest';
import { getInitials, isValidResourceLink } from '../general-helpers';

describe('getInitials', () => {
  it('returns initials for a normal name', () => {
    expect(getInitials('Ole Hansen')).toBe('OH');
  });

  it('handles extra spaces between names', () => {
    expect(getInitials('Ole   Hansen')).toBe('OH');
    expect(getInitials('  Ole   Hansen  ')).toBe('OH');
  });

  it('returns only first initial for single name', () => {
    expect(getInitials('Ole')).toBe('O');
  });

  it('returns empty string for empty input', () => {
    expect(getInitials('')).toBe('');
    expect(getInitials('   ')).toBe('');
    expect(getInitials(undefined as any)).toBe('');
    expect(getInitials(null as any)).toBe('');
  });

  it('handles names with more than two words', () => {
    expect(getInitials('Ole Petter Hansen')).toBe('OH');
    expect(getInitials('Anna Maria Smith')).toBe('AS');
  });

  it('handles names with special characters', () => {
    expect(getInitials('Åse Ødegård')).toBe('ÅØ');
  });
});

describe('isValidResourceLink', () => {
  it('accepts a DOI URL', () => {
    expect(isValidResourceLink('https://doi.org/10.1000/xyz123')).toBe(true);
    expect(isValidResourceLink('http://dx.doi.org/10.1000/xyz123')).toBe(true);
  });

  it('accepts a bare DOI', () => {
    expect(isValidResourceLink('10.1000/xyz123')).toBe(true);
  });

  it('accepts a link that is not a DOI', () => {
    expect(isValidResourceLink('https://example.com/article/1')).toBe(true);
  });

  it('ignores surrounding whitespace', () => {
    expect(isValidResourceLink('  https://doi.org/10.1000/xyz123  ')).toBe(true);
    expect(isValidResourceLink('\n10.1000/xyz123\n')).toBe(true);
  });

  it('rejects text that is neither a link nor a DOI', () => {
    expect(isValidResourceLink('hei')).toBe(false);
    expect(isValidResourceLink('12345')).toBe(false);
    expect(isValidResourceLink('example.com')).toBe(false);
  });

  it('rejects an empty value', () => {
    expect(isValidResourceLink('')).toBe(false);
    expect(isValidResourceLink('   ')).toBe(false);
  });
});
