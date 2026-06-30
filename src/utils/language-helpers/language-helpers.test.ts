import { describe, expect, it } from 'vitest';
import { getLanguageOptions } from './language-helpers';

const primaryLanguageCodes = ['eng', 'nob', 'nno', 'sme', 'sma', 'smj', 'mul'];

describe('getLanguageOptions', () => {
  it('returns primary languages in the correct order', () => {
    const { primaryLanguages } = getLanguageOptions('nob');
    expect(primaryLanguages.map((l) => l.iso6393Code)).toEqual(primaryLanguageCodes);
  });

  it('does not include primary languages in restOfLanguages', () => {
    const { restOfLanguages } = getLanguageOptions('nob');
    const restCodes = restOfLanguages.map((l) => l.iso6393Code);
    primaryLanguageCodes.forEach((code) => {
      expect(restCodes).not.toContain(code);
    });
  });

  it('returns restOfLanguages sorted alphabetically for the given languageCode', () => {
    const { restOfLanguages } = getLanguageOptions('nob');
    const withoutUnd = restOfLanguages.filter((l) => l.iso6393Code !== 'und');
    for (let i = 0; i < withoutUnd.length - 1; i++) {
      expect(withoutUnd[i].nob.localeCompare(withoutUnd[i + 1].nob, 'nb')).toBeLessThanOrEqual(0);
    }
  });

  it('returns und as the last element in restOfLanguages', () => {
    const { restOfLanguages } = getLanguageOptions('nob');
    expect(restOfLanguages[restOfLanguages.length - 1].iso6393Code).toBe('und');
  });

  it('sorts restOfLanguages differently based on languageCode', () => {
    const { restOfLanguages: nobLanguages } = getLanguageOptions('nob');
    const { restOfLanguages: engLanguages } = getLanguageOptions('eng');
    const nobOrder = nobLanguages.map((l) => l.iso6393Code);
    const engOrder = engLanguages.map((l) => l.iso6393Code);
    expect(nobOrder).not.toEqual(engOrder);
  });
});
