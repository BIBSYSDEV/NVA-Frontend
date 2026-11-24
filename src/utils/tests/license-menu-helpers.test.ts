import { describe, expect, test } from 'vitest';
import { AssociatedArtifact, FileType } from '../../types/associatedArtifact.types';
import { LicenseUri } from '../../types/license.types';
import { JournalType, ResearchDataType } from '../../types/publicationFieldNames';
import {
  getAdditionalLicenses,
  getHelpModalLicenses,
  getLicenseFieldsToReset,
  getShortListLicenses,
  hasSameLicenseMenu,
  isCorrectLicenseForCategory,
  isLockedOnCorrectLicense,
  licenseNeedsReset,
} from '../license-menu-helpers';
import { makeFile, makeLockedFile } from '../test-utils/factories/file';

const editableFile = (license: string | null) => makeFile({ license });

const lockedFile = (license: string | null) => makeLockedFile({ license });

const associatedLink = { type: 'AssociatedLink', id: 'https://sikt.no' } as AssociatedArtifact;

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

describe('isCorrectLicenseForCategory()', () => {
  test('Accepts a license from either menu section for source code', () => {
    expect(isCorrectLicenseForCategory(LicenseUri.MIT, ResearchDataType.SoftwareSourceCode)).toBe(true);
    expect(isCorrectLicenseForCategory(LicenseUri.GPL_3_0_only, ResearchDataType.SoftwareSourceCode)).toBe(true);
  });

  test('Rejects a Creative Commons license for source code', () => {
    expect(isCorrectLicenseForCategory(LicenseUri.CC_BY_4, ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Rejects a software license for other categories', () => {
    expect(isCorrectLicenseForCategory(LicenseUri.MIT, JournalType.AcademicArticle)).toBe(false);
  });

  test('Accepts current and older Creative Commons licenses for other categories', () => {
    expect(isCorrectLicenseForCategory(LicenseUri.CC_BY_4, JournalType.AcademicArticle)).toBe(true);
    expect(isCorrectLicenseForCategory(LicenseUri.CC_BY_3, JournalType.AcademicArticle)).toBe(true);
  });

  test('Accepts Generelle bruksvilkår only outside source code', () => {
    expect(isCorrectLicenseForCategory(LicenseUri.CopyrightAct, JournalType.AcademicArticle)).toBe(true);
    expect(isCorrectLicenseForCategory(LicenseUri.CopyrightAct, ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Accepts CC0 for both source code and other categories', () => {
    expect(isCorrectLicenseForCategory(LicenseUri.CC0, ResearchDataType.SoftwareSourceCode)).toBe(true);
    expect(isCorrectLicenseForCategory(LicenseUri.CC0, JournalType.AcademicArticle)).toBe(true);
  });

  test('Rejects a file without a license', () => {
    expect(isCorrectLicenseForCategory(null, ResearchDataType.SoftwareSourceCode)).toBe(false);
    expect(isCorrectLicenseForCategory('', ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Rejects a license that is not in the vocabulary', () => {
    expect(isCorrectLicenseForCategory('123', ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Matches an SPDX uri stored without the .html suffix', () => {
    expect(isCorrectLicenseForCategory('https://spdx.org/licenses/MIT', ResearchDataType.SoftwareSourceCode)).toBe(
      true
    );
  });
});

describe('licenseNeedsReset()', () => {
  test('Clears a license the new category does not offer', () => {
    expect(licenseNeedsReset(editableFile(LicenseUri.CC_BY_4), ResearchDataType.SoftwareSourceCode)).toBe(true);
    expect(licenseNeedsReset(editableFile(LicenseUri.MIT), JournalType.AcademicArticle)).toBe(true);
  });

  test('Keeps a license the new category still offers', () => {
    expect(licenseNeedsReset(editableFile(LicenseUri.CC0), ResearchDataType.SoftwareSourceCode)).toBe(false);
    expect(licenseNeedsReset(editableFile(LicenseUri.CC_BY_4), JournalType.AcademicArticle)).toBe(false);
  });

  test('Keeps a license the user has no write access to change', () => {
    expect(licenseNeedsReset(lockedFile(LicenseUri.CC_BY_4), ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Clears a license on an import candidate file the importer may edit', () => {
    expect(licenseNeedsReset(lockedFile(LicenseUri.CC_BY_4), ResearchDataType.SoftwareSourceCode, true)).toBe(true);
  });

  test('Leaves a file without a license alone, importer or not', () => {
    expect(licenseNeedsReset(lockedFile(null), ResearchDataType.SoftwareSourceCode, true)).toBe(false);
  });

  test('Keeps a license on a file with no access rights at all', () => {
    const fileWithoutOperations = makeFile({ license: LicenseUri.CC_BY_4, allowedOperations: undefined });

    expect(licenseNeedsReset(fileWithoutOperations, ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test.each([
    FileType.RejectedFile,
    FileType.InternalFile,
    FileType.PendingInternalFile,
    FileType.HiddenFile,
    FileType.UpdloadedFile,
  ])('Clears a license on a %s, even though the form shows no license field for it', (type) => {
    const file = makeFile({ type, license: LicenseUri.CC_BY_4 });

    expect(licenseNeedsReset(file, ResearchDataType.SoftwareSourceCode)).toBe(true);
  });

  test('Leaves a file without a license untouched, so null is not overwritten with an empty string', () => {
    expect(licenseNeedsReset(editableFile(null), ResearchDataType.SoftwareSourceCode)).toBe(false);
    expect(licenseNeedsReset(editableFile(''), ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Leaves artifacts that are not files untouched', () => {
    expect(licenseNeedsReset(associatedLink, ResearchDataType.SoftwareSourceCode)).toBe(false);
  });
});

describe('getLicenseFieldsToReset()', () => {
  test('Clears nothing when the category change stays within one license menu', () => {
    const result = getLicenseFieldsToReset(
      [editableFile(LicenseUri.CC_BY_4)],
      JournalType.AcademicArticle,
      ResearchDataType.Dataset
    );

    expect(result).toEqual([]);
  });

  test('Leaves a license neither category offers alone, since the menu it is wrong for did not change', () => {
    const result = getLicenseFieldsToReset(
      [editableFile(LicenseUri.MIT)],
      JournalType.AcademicArticle,
      ResearchDataType.Dataset
    );

    expect(result).toEqual([]);
  });

  test('Clears nothing when the category does not change at all', () => {
    const result = getLicenseFieldsToReset(
      [editableFile(LicenseUri.MIT)],
      ResearchDataType.SoftwareSourceCode,
      ResearchDataType.SoftwareSourceCode
    );

    expect(result).toEqual([]);
  });

  test('Builds the path Formik holds the license at', () => {
    const result = getLicenseFieldsToReset(
      [editableFile(LicenseUri.CC_BY_4)],
      JournalType.AcademicArticle,
      ResearchDataType.SoftwareSourceCode
    );

    expect(result).toEqual(['associatedArtifacts[0].license']);
  });

  test('Keeps each index pointing at its own artifact, links included', () => {
    const result = getLicenseFieldsToReset(
      [associatedLink, editableFile(LicenseUri.CC0), editableFile(LicenseUri.CC_BY_4)],
      JournalType.AcademicArticle,
      ResearchDataType.SoftwareSourceCode
    );

    expect(result).toEqual(['associatedArtifacts[2].license']);
  });

  test('Clears every file the new category no longer offers a license for', () => {
    const result = getLicenseFieldsToReset(
      [editableFile(LicenseUri.CC_BY_4), editableFile(LicenseUri.CC_BY_3)],
      JournalType.AcademicArticle,
      ResearchDataType.SoftwareSourceCode
    );

    expect(result).toEqual(['associatedArtifacts[0].license', 'associatedArtifacts[1].license']);
  });

  test('Leaves a license the user cannot edit, unless they are the importer', () => {
    const artifacts = [lockedFile(LicenseUri.CC_BY_4)];

    expect(
      getLicenseFieldsToReset(artifacts, JournalType.AcademicArticle, ResearchDataType.SoftwareSourceCode)
    ).toEqual([]);
    expect(
      getLicenseFieldsToReset(artifacts, JournalType.AcademicArticle, ResearchDataType.SoftwareSourceCode, true)
    ).toEqual(['associatedArtifacts[0].license']);
  });

  test('Clears nothing on a registration without artifacts', () => {
    const result = getLicenseFieldsToReset([], JournalType.AcademicArticle, ResearchDataType.SoftwareSourceCode);

    expect(result).toEqual([]);
  });
});

describe('isLockedOnCorrectLicense()', () => {
  test('Category change is prohibited when license is source code only and category is source code', () => {
    expect(isLockedOnCorrectLicense(lockedFile(LicenseUri.MIT), ResearchDataType.SoftwareSourceCode)).toBe(true);
  });

  test('Category change is prohibited when license is non-source code and category is non-source code', () => {
    expect(isLockedOnCorrectLicense(lockedFile(LicenseUri.CC_BY_4), JournalType.AcademicArticle)).toBe(true);
  });

  test('Category change is not prohibited when license is offered in both menus', () => {
    expect(isLockedOnCorrectLicense(lockedFile(LicenseUri.CC0), ResearchDataType.SoftwareSourceCode)).toBe(false);
    expect(isLockedOnCorrectLicense(lockedFile(LicenseUri.CC0), JournalType.AcademicArticle)).toBe(false);
  });

  test('Category change is not prohibited when file is editable', () => {
    expect(isLockedOnCorrectLicense(editableFile(LicenseUri.MIT), ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Category change is not prohibited for an import candidate file that the importer may edit', () => {
    expect(isLockedOnCorrectLicense(lockedFile(LicenseUri.MIT), ResearchDataType.SoftwareSourceCode, true)).toBe(false);
  });

  test('Category change is not prohibited when only the other menu offers the license', () => {
    expect(isLockedOnCorrectLicense(lockedFile(LicenseUri.CC_BY_2), ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Category change is not prohibited for files without a license', () => {
    expect(isLockedOnCorrectLicense(lockedFile(null), JournalType.AcademicArticle)).toBe(false);
    expect(isLockedOnCorrectLicense(lockedFile(''), JournalType.AcademicArticle)).toBe(false);
  });

  test.each([
    FileType.RejectedFile,
    FileType.InternalFile,
    FileType.PendingInternalFile,
    FileType.HiddenFile,
    FileType.UpdloadedFile,
  ])('Category change is not prohibited by a %s, which shows no license field to be locked on', (type) => {
    const file = makeLockedFile({ type, license: LicenseUri.MIT });

    expect(isLockedOnCorrectLicense(file, ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Category change is not prohibited for artifacts that are not files', () => {
    expect(isLockedOnCorrectLicense(associatedLink, JournalType.AcademicArticle)).toBe(false);
  });

  test('Category change is prohibited for a file waiting for approval, which has a license field too', () => {
    const pendingFile = makeLockedFile({ type: FileType.PendingOpenFile, license: LicenseUri.MIT });

    expect(isLockedOnCorrectLicense(pendingFile, ResearchDataType.SoftwareSourceCode)).toBe(true);
  });

  test.each([FileType.RejectedFile, FileType.InternalFile, FileType.HiddenFile])(
    'Category change is not prohibited for a %s, which is shown no license field to act on',
    (type) => {
      const file = makeLockedFile({ type, license: LicenseUri.MIT });

      expect(isLockedOnCorrectLicense(file, ResearchDataType.SoftwareSourceCode)).toBe(false);
    }
  );
});

describe('hasSameLicenseMenu()', () => {
  test('Keeps every category outside source code on one menu', () => {
    expect(hasSameLicenseMenu(JournalType.AcademicArticle, ResearchDataType.Dataset)).toBe(true);
    expect(hasSameLicenseMenu(undefined, JournalType.AcademicArticle)).toBe(true);
  });

  test('Puts source code on a menu of its own', () => {
    expect(hasSameLicenseMenu(ResearchDataType.SoftwareSourceCode, ResearchDataType.Dataset)).toBe(false);
    expect(hasSameLicenseMenu(JournalType.AcademicArticle, ResearchDataType.SoftwareSourceCode)).toBe(false);
  });

  test('Leaves a category on its own menu', () => {
    expect(hasSameLicenseMenu(ResearchDataType.SoftwareSourceCode, ResearchDataType.SoftwareSourceCode)).toBe(true);
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
