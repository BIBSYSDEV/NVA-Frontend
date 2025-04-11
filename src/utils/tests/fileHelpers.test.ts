import { describe, expect, test } from 'vitest';
import { LicenseUri } from '../../types/license.types';
import { getLicenseData } from '../fileHelpers';

describe('getLicenseData()', () => {
  test('Returns Creative Commons license with https', () => {
    const result = getLicenseData('https://creativecommons.org/licenses/by/4.0/');
    expect(result?.id).toBe(LicenseUri.CC_BY_4);
  });

  test('Returns Creative Commons license with http and no trailing slash', () => {
    const result = getLicenseData('http://creativecommons.org/licenses/by/4.0');
    expect(result?.id).toBe(LicenseUri.CC_BY_4);
  });

  test('Returns Creative Commons license independent of casing', () => {
    const license = 'https://creativecommons.org/licenses/by/2.0';

    const resultWithLowerCase = getLicenseData(license.toLowerCase())?.id;
    expect(resultWithLowerCase).toBe(LicenseUri.CC_BY_2);

    const resultWithUpperCase = getLicenseData(license.toUpperCase())?.id;
    expect(resultWithUpperCase).toBe(LicenseUri.CC_BY_2);
  });

  test('Returns RightsReserved license with https', () => {
    const result = getLicenseData('https://rightsstatements.org/vocab/InC/1.0/');
    expect(result?.id).toBe(LicenseUri.RightsReserved);
  });

  test('Returns RightsReserved license with http', () => {
    const result = getLicenseData('http://rightsstatements.org/vocab/InC/1.0/');
    expect(result?.id).toBe(LicenseUri.RightsReserved);
  });

  test('Returnes null when RightsReserved license lacks trailing slash', () => {
    const result = getLicenseData('https://rightsstatements.org/vocab/InC/1.0');
    expect(result).toBe(null);
  });

  test('Returnes null when RightsReserved license has invalid casing', () => {
    const result = getLicenseData('https://rightsstatements.org/vocab/Inc/1.0/');
    expect(result).toBe(null);
  });

  test('Returnes null when no matching license is found', () => {
    const resultInvalidUri = getLicenseData('https://creativecommons.org/licenses/asd/');
    expect(resultInvalidUri).toBe(null);

    const resultEmptyUri = getLicenseData('');
    expect(resultEmptyUri).toBe(null);
  });
});
