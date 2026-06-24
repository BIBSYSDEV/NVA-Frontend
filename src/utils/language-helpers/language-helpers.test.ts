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
    for (let i = 0; i < restOfLanguages.length - 1; i++) {
      expect(restOfLanguages[i].nob.localeCompare(restOfLanguages[i + 1].nob, 'nb')).toBeLessThanOrEqual(0);
    }
  });

  it('sorts restOfLanguages differently based on languageCode', () => {
    const { restOfLanguages: nobLanguages } = getLanguageOptions('nob');
    const { restOfLanguages: engLanguages } = getLanguageOptions('eng');
    const nobNames = nobLanguages.map((l) => l.nob);
    const engNames = engLanguages.map((l) => l.eng);
    expect(nobNames).not.toEqual(engNames);
  });
});
