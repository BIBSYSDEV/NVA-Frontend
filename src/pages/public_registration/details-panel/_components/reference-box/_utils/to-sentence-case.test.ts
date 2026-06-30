import { describe, expect, it } from 'vitest';
import { toSentenceCase } from './to-sentence-case';

describe('toSentenceCase', () => {
  it('Converts an all-caps title to sentence case', () => {
    expect(toSentenceCase('AN ANALYSIS OF CLIMATE DATA')).toBe('An analysis of climate data');
  });

  it('Converts a title-case title to sentence case', () => {
    expect(toSentenceCase('An Analysis of Climate Data')).toBe('An analysis of climate data');
  });

  it('Leaves a title that is already sentence case unchanged', () => {
    expect(toSentenceCase('An analysis of climate data in Norway')).toBe('An analysis of climate data in Norway');
  });

  it('Preserves capitalisation of the subtitle after a colon', () => {
    expect(toSentenceCase('Machine Learning: A New Approach')).toBe('Machine learning: A new approach');
  });

  it('Preserves an acronym while sentence-casing a title containing a proper noun', () => {
    expect(toSentenceCase('The Role of DNA in Cancer Research')).toBe('The role of DNA in cancer research');
  });

  it('Preserves capitalisation inside parentheses', () => {
    expect(toSentenceCase('A Study Conducted With NASA (In Collaboration)')).toBe(
      'A study conducted with NASA (In Collaboration)'
    );
  });

  it('Returns an empty title unchanged', () => {
    expect(toSentenceCase('')).toBe('');
  });
});
