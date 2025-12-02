import { describe, expect, it } from 'vitest';
import { getInitials } from '../general-helpers';

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
