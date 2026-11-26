import { describe, expect, test } from 'vitest';
import { FileAllowedOperation } from '../../types/associatedArtifact.types';
import { LicenseUri } from '../../types/license.types';
import { getLicenseData, userAllowedToEditFileMetadata } from '../fileHelpers';
import { makeFile } from '../test-utils/factories/file';

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

  test('Returns copyright act license without trailing slash', () => {
    const result = getLicenseData('https://nva.sikt.no/license/copyright-act/1.0');
    expect(result?.id).toBe(LicenseUri.CopyrightAct);
  });

  test('Returns copyright act license with trailing slash', () => {
    const result = getLicenseData('https://nva.sikt.no/license/copyright-act/1.0/');
    expect(result?.id).toBe(LicenseUri.CopyrightAct);
  });

  test('Returnes null when no matching license is found', () => {
    const resultInvalidUri = getLicenseData('https://creativecommons.org/licenses/asd/');
    expect(resultInvalidUri).toBe(null);

    const resultEmptyUri = getLicenseData('');
    expect(resultEmptyUri).toBe(null);
  });

  test('Returns software license by its SPDX uri', () => {
    const result = getLicenseData('https://spdx.org/licenses/GPL-3.0-or-later.html');
    expect(result?.id).toBe(LicenseUri.GPL_3_0_or_later);
  });

  test('Keeps -only and -or-later as distinct licenses', () => {
    const onlyLicense = getLicenseData('https://spdx.org/licenses/GPL-3.0-only.html');
    const orLaterLicense = getLicenseData('https://spdx.org/licenses/GPL-3.0-or-later.html');

    expect(onlyLicense?.id).toBe(LicenseUri.GPL_3_0_only);
    expect(orLaterLicense?.id).toBe(LicenseUri.GPL_3_0_or_later);
  });
});

describe('userMayEditFileMetadata()', () => {
  const fileWith = (...allowedOperations: FileAllowedOperation[]) => makeFile({ allowedOperations });

  test('Lets a user with write access edit the file', () => {
    expect(userAllowedToEditFileMetadata(fileWith('write-metadata'))).toBe(true);
  });

  test('Keeps a user without write access out', () => {
    expect(userAllowedToEditFileMetadata(fileWith('download'))).toBe(false);
    expect(userAllowedToEditFileMetadata(makeFile({ allowedOperations: undefined }))).toBe(false);
  });

  test('Lets an importer edit an import candidate file whatever its access rights say', () => {
    expect(userAllowedToEditFileMetadata(fileWith('download'), true)).toBe(true);
  });
});
