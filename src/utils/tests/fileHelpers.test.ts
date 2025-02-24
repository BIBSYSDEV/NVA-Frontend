import { describe, expect, test } from 'vitest';
import { LicenseUri } from '../../types/license.types';
import { getLicenseData } from '../fileHelpers';

describe('getLicenseData()', () => {
  test('Gets CC-BY license with https', () => {
    const result = getLicenseData('https://creativecommons.org/licenses/by/4.0/');
    expect(result?.id).toBe(LicenseUri.CC_BY_4);
  });

  test('Gets CC-BY license with http and no trailing slash', () => {
    const result = getLicenseData('http://creativecommons.org/licenses/by/4.0');
    expect(result?.id).toBe(LicenseUri.CC_BY_4);
  });

  test('Gets RightsReserved license with https', () => {
    const result = getLicenseData('https://rightsstatements.org/vocab/InC/1.0/');
    expect(result?.id).toBe(LicenseUri.RightsReserved);
  });

  test('Gets RightsReserved license with http', () => {
    const result = getLicenseData('http://rightsstatements.org/vocab/InC/1.0/');
    expect(result?.id).toBe(LicenseUri.RightsReserved);
  });

  test('Fails to get RightsReserved license without trailing slash', () => {
    const result = getLicenseData('https://rightsstatements.org/vocab/InC/1.0');
    expect(result).toBe(null);
  });

  test('Fails to get RightsReserved license with invalid casing', () => {
    const result = getLicenseData('https://rightsstatements.org/vocab/Inc/1.0/');
    expect(result).toBe(null);
  });
});
