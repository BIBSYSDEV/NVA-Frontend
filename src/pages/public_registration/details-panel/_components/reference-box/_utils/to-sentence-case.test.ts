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

  it('Capitalises the first word after a period', () => {
    expect(toSentenceCase('Water and People. Questions from Journeys around the World')).toBe(
      'Water and people. Questions from journeys around the world'
    );
  });

  it('Capitalises the first word after a question mark', () => {
    expect(toSentenceCase('Why Do We Sleep? Answers from Modern Research')).toBe(
      'Why do we sleep? Answers from modern research'
    );
  });

  it('Keeps a dotted abbreviation and the word after it as they are', () => {
    expect(toSentenceCase('Trade Policy of the U.S. Government and Its Effects')).toBe(
      'Trade policy of the U.S. government and its effects'
    );
  });

  it('Does not capitalise the word after a lowercase dotted abbreviation', () => {
    expect(toSentenceCase('Classic Growth Models, e.g. Neoclassical and Endogenous Approaches')).toBe(
      'Classic growth models, e.g. neoclassical and endogenous approaches'
    );
  });

  it('Does not capitalise the word after a known abbreviation', () => {
    expect(toSentenceCase('Fish, Birds, Mammals etc. Across Northern Habitats')).toBe(
      'Fish, birds, mammals etc. across northern habitats'
    );
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
