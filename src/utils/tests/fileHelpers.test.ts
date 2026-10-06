import { describe, expect, test } from 'vitest';
import { LicenseUri } from '../../types/license.types';
import { JournalType, ResearchDataType } from '../../types/publicationFieldNames';
import { getFullListLicenses, getHelpModalLicenses, getLicenseData, getShortListLicenses } from '../fileHelpers';

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
    expect(result?.spdxId).toBe('GPL-3.0-or-later');
  });

  test('Keeps -only and -or-later as distinct licenses', () => {
    const onlyLicense = getLicenseData('https://spdx.org/licenses/GPL-3.0-only.html');
    const orLaterLicense = getLicenseData('https://spdx.org/licenses/GPL-3.0-or-later.html');

    expect(onlyLicense?.id).toBe(LicenseUri.GPL_3_0_only);
    expect(orLaterLicense?.id).toBe(LicenseUri.GPL_3_0_or_later);
  });
});

describe('getShortListLicenses()', () => {
  test('Offers the software short list for source code, in menu order', () => {
    const result = getShortListLicenses(ResearchDataType.SoftwareSourceCode).map((license) => license.id);

    expect(result).toEqual([
      LicenseUri.MIT,
      LicenseUri.Apache_2_0,
      LicenseUri.GPL_3_0_or_later,
      LicenseUri.BSD_3_Clause,
      LicenseUri.EUPL_1_2,
      LicenseUri.CC0,
    ]);
  });

  test('Does not offer Generelle bruksvilkår for source code', () => {
    const result = getShortListLicenses(ResearchDataType.SoftwareSourceCode).map((license) => license.id);

    expect(result).not.toContain(LicenseUri.CopyrightAct);
    expect(result).toHaveLength(6);
  });

  test('Keeps the Creative Commons short list for other categories', () => {
    const result = getShortListLicenses(JournalType.AcademicArticle).map((license) => license.id);

    expect(result).toContain(LicenseUri.CC_BY_4);
    expect(result).not.toContain(LicenseUri.MIT);
  });

  test('Keeps the Creative Commons short list when category is unknown', () => {
    const result = getShortListLicenses(undefined).map((license) => license.id);

    expect(result).not.toContain(LicenseUri.MIT);
  });
});

describe('getFullListLicenses()', () => {
  test('Offers the nine remaining software licenses for source code, in menu order', () => {
    const result = getFullListLicenses(ResearchDataType.SoftwareSourceCode).map((license) => license.id);

    expect(result).toEqual([
      LicenseUri.BSD_2_Clause,
      LicenseUri.GPL_2_0_or_later,
      LicenseUri.AGPL_3_0_or_later,
      LicenseUri.LGPL_3_0_or_later,
      LicenseUri.MPL_2_0,
      LicenseUri.GPL_2_0_only,
      LicenseUri.GPL_3_0_only,
      LicenseUri.AGPL_3_0_only,
      LicenseUri.LGPL_3_0_only,
    ]);
  });

  test('Keeps older Creative Commons versions for other categories', () => {
    const result = getFullListLicenses(JournalType.AcademicArticle).map((license) => license.id);

    expect(result).toContain(LicenseUri.CC_BY_3);
    expect(result).not.toContain(LicenseUri.GPL_3_0_only);
  });

  test('Explains the ten software licenses with CC0 last, leaving out the -only variants', () => {
    const result = getHelpModalLicenses(ResearchDataType.SoftwareSourceCode).map((license) => license.id);

    expect(result).toEqual([
      LicenseUri.MIT,
      LicenseUri.Apache_2_0,
      LicenseUri.GPL_3_0_or_later,
      LicenseUri.BSD_3_Clause,
      LicenseUri.EUPL_1_2,
      LicenseUri.BSD_2_Clause,
      LicenseUri.GPL_2_0_or_later,
      LicenseUri.AGPL_3_0_or_later,
      LicenseUri.LGPL_3_0_or_later,
      LicenseUri.MPL_2_0,
      LicenseUri.CC0,
    ]);
  });

  test('Explains the Creative Commons licenses for other categories', () => {
    const result = getHelpModalLicenses(JournalType.AcademicArticle).map((license) => license.id);

    expect(result).toContain(LicenseUri.CC_BY_4);
    expect(result).not.toContain(LicenseUri.MIT);
  });

  test('Offers every source code license exactly once across the two lists', () => {
    const shortList = getShortListLicenses(ResearchDataType.SoftwareSourceCode);
    const fullList = getFullListLicenses(ResearchDataType.SoftwareSourceCode);
    const allIds = [...shortList, ...fullList].map((license) => license.id);

    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
