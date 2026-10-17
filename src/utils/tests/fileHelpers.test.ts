import { describe, expect, test } from 'vitest';
import { AssociatedArtifact, AssociatedFile, FileType } from '../../types/associatedArtifact.types';
import { LicenseUri } from '../../types/license.types';
import { JournalType, ResearchDataType } from '../../types/publicationFieldNames';
import {
  getAdditionalLicenses,
  getHelpModalLicenses,
  getLicenseData,
  getShortListLicenses,
  isSelectableLicense,
  licenseNeedsReset,
} from '../fileHelpers';

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

describe('getAdditionalLicenses()', () => {
  test('Offers the remaining software licenses for source code, in menu order', () => {
    const result = getAdditionalLicenses(ResearchDataType.SoftwareSourceCode).map((license) => license.id);

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
    const result = getAdditionalLicenses(JournalType.AcademicArticle).map((license) => license.id);

    expect(result).toContain(LicenseUri.CC_BY_3);
    expect(result).not.toContain(LicenseUri.GPL_3_0_only);
  });

  test('Keeps older Creative Commons versions when category is unknown', () => {
    const result = getAdditionalLicenses(undefined).map((license) => license.id);

    expect(result).toContain(LicenseUri.CC_BY_3);
    expect(result).not.toContain(LicenseUri.GPL_3_0_only);
  });
});

describe('getHelpModalLicenses()', () => {
  test('Explains the software licenses with CC0 last, leaving out the -only variants', () => {
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

  test('Explains the Creative Commons licenses when category is unknown', () => {
    const result = getHelpModalLicenses(undefined).map((license) => license.id);

    expect(result).toContain(LicenseUri.CC_BY_4);
    expect(result).not.toContain(LicenseUri.MIT);
  });
});

describe('isSelectableLicense()', () => {
  test('Accepts a license from either menu section for source code', () => {
    expect(isSelectableLicense(LicenseUri.MIT, ResearchDataType.SoftwareSourceCode)).toBe(true);
    expect(isSelectableLicense(LicenseUri.GPL_3_0_only, ResearchDataType.SoftwareSourceCode)).toBe(true);
  });

  test('Rejects a Creative Commons license for source code', () => {
    expect(isSelectableLicense(LicenseUri.CC_BY_4, ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Rejects a software license for other categories', () => {
    expect(isSelectableLicense(LicenseUri.MIT, JournalType.AcademicArticle)).toBe(false);
  });

  test('Accepts current and older Creative Commons licenses for other categories', () => {
    expect(isSelectableLicense(LicenseUri.CC_BY_4, JournalType.AcademicArticle)).toBe(true);
    expect(isSelectableLicense(LicenseUri.CC_BY_3, JournalType.AcademicArticle)).toBe(true);
  });

  test('Accepts Generelle bruksvilkår only outside source code', () => {
    expect(isSelectableLicense(LicenseUri.CopyrightAct, JournalType.AcademicArticle)).toBe(true);
    expect(isSelectableLicense(LicenseUri.CopyrightAct, ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Accepts CC0 for both source code and other categories', () => {
    expect(isSelectableLicense(LicenseUri.CC0, ResearchDataType.SoftwareSourceCode)).toBe(true);
    expect(isSelectableLicense(LicenseUri.CC0, JournalType.AcademicArticle)).toBe(true);
  });

  test('Rejects a file without a license', () => {
    expect(isSelectableLicense(null, ResearchDataType.SoftwareSourceCode)).toBe(false);
    expect(isSelectableLicense('', ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Rejects a license that is not in the vocabulary', () => {
    expect(isSelectableLicense('123', ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Matches an SPDX uri stored without the .html suffix', () => {
    expect(isSelectableLicense('https://spdx.org/licenses/MIT', ResearchDataType.SoftwareSourceCode)).toBe(true);
  });
});

describe('licenseNeedsReset()', () => {
  const editableFile = (license: string | null) =>
    ({ type: FileType.OpenFile, license, allowedOperations: ['write-metadata'] }) as AssociatedFile;

  const fileWithoutWriteAccess = (license: string | null) =>
    ({ type: FileType.OpenFile, license, allowedOperations: ['download'] }) as AssociatedFile;

  test('Clears a license the new category does not offer', () => {
    expect(licenseNeedsReset(editableFile(LicenseUri.CC_BY_4), ResearchDataType.SoftwareSourceCode)).toBe(true);
    expect(licenseNeedsReset(editableFile(LicenseUri.MIT), JournalType.AcademicArticle)).toBe(true);
  });

  test('Keeps a license the new category still offers', () => {
    expect(licenseNeedsReset(editableFile(LicenseUri.CC0), ResearchDataType.SoftwareSourceCode)).toBe(false);
    expect(licenseNeedsReset(editableFile(LicenseUri.CC_BY_4), JournalType.AcademicArticle)).toBe(false);
  });

  test('Keeps a license the user has no write access to change', () => {
    expect(licenseNeedsReset(fileWithoutWriteAccess(LicenseUri.CC_BY_4), ResearchDataType.SoftwareSourceCode)).toBe(
      false
    );
  });

  test('Clears a license on an import candidate file the importer may edit', () => {
    expect(
      licenseNeedsReset(fileWithoutWriteAccess(LicenseUri.CC_BY_4), ResearchDataType.SoftwareSourceCode, true)
    ).toBe(true);
  });

  test('Leaves a file without a license alone, importer or not', () => {
    expect(licenseNeedsReset(fileWithoutWriteAccess(null), ResearchDataType.SoftwareSourceCode, true)).toBe(false);
  });

  test('Keeps a license on a file with no access rights at all', () => {
    const fileWithoutOperations = { type: FileType.OpenFile, license: LicenseUri.CC_BY_4 } as AssociatedFile;

    expect(licenseNeedsReset(fileWithoutOperations, ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Leaves a file without a license untouched, so null is not overwritten with an empty string', () => {
    expect(licenseNeedsReset(editableFile(null), ResearchDataType.SoftwareSourceCode)).toBe(false);
    expect(licenseNeedsReset(editableFile(''), ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Leaves artifacts that are not files untouched', () => {
    const link = { type: 'AssociatedLink', id: 'https://sikt.no' } as AssociatedArtifact;

    expect(licenseNeedsReset(link, ResearchDataType.SoftwareSourceCode)).toBe(false);
  });
});

describe('The source code license menu', () => {
  const sourceCodeMenuIds = [
    ...getShortListLicenses(ResearchDataType.SoftwareSourceCode),
    ...getAdditionalLicenses(ResearchDataType.SoftwareSourceCode),
  ].map((license) => license.id);

  test('Offers every license exactly once', () => {
    expect(new Set(sourceCodeMenuIds).size).toBe(sourceCodeMenuIds.length);
  });

  test('Does not offer Generelle bruksvilkår in either section', () => {
    expect(sourceCodeMenuIds).not.toContain(LicenseUri.CopyrightAct);
  });

  test('Explains every license it offers, apart from the -only variants', () => {
    const explainedIds = getHelpModalLicenses(ResearchDataType.SoftwareSourceCode).map((license) => license.id);
    const onlyVariants = [
      LicenseUri.GPL_2_0_only,
      LicenseUri.GPL_3_0_only,
      LicenseUri.AGPL_3_0_only,
      LicenseUri.LGPL_3_0_only,
    ];

    const unexplained = sourceCodeMenuIds.filter((id) => !explainedIds.includes(id));
    expect(unexplained).toEqual(onlyVariants);
  });
});
