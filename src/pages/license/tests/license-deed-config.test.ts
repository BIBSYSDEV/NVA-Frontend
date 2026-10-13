import { describe, expect, test } from 'vitest';
import nbTranslations from '../../../translations/nbTranslations.json';
import { LicenseDeedSlug, licenses, LicenseUri } from '../../../types/license.types';
import { ResearchDataType } from '../../../types/publicationFieldNames';
import { getAdditionalLicenses, getShortListLicenses } from '../../../utils/fileHelpers';
import {
  getLicenseDeed,
  LicenseRule,
  LicenseRuleGroup,
  licenseDeeds,
  LicenseVersionNote,
} from '../license-deed-config';

const sourceCodeMenuLicenses = [
  ...getShortListLicenses(ResearchDataType.SoftwareSourceCode),
  ...getAdditionalLicenses(ResearchDataType.SoftwareSourceCode),
];

describe('licenseDeeds', () => {
  test('Serves a deed for every slug', () => {
    const slugs = licenseDeeds.map((deed) => deed.slug);

    expect(slugs).toEqual(expect.arrayContaining(Object.values(LicenseDeedSlug)));
    expect(slugs).toHaveLength(Object.values(LicenseDeedSlug).length);
  });

  test('Uses every slug exactly once', () => {
    const slugs = licenseDeeds.map((deed) => deed.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test('Summarises a license that exists in the vocabulary', () => {
    licenseDeeds.forEach((deed) => {
      expect(licenses.some((license) => license.id === deed.licenseId)).toBe(true);
    });
  });

  test('Lists at least one term in every deed, so no page renders empty', () => {
    licenseDeeds.forEach((deed) => {
      expect(deed.permissions.length + deed.conditions.length + deed.limitations.length).toBeGreaterThan(0);
    });
  });

  test('Links to an official license text over https', () => {
    licenseDeeds.forEach((deed) => {
      expect(deed.officialUrl).toMatch(/^https:\/\//);
    });
  });
});

describe('The deeds and the source code license menu', () => {
  test('Gives every license the menu offers a deed to link to, apart from CC0', () => {
    const deedPaths = licenseDeeds.map((deed) => `/license/${deed.slug}`);

    sourceCodeMenuLicenses
      .filter(({ id }) => id !== LicenseUri.CC0)
      .forEach((license) => {
        expect(deedPaths).toContain(license.link);
      });
  });

  test('Serves ten deeds for the fourteen software licenses', () => {
    const softwareLicenseCount = sourceCodeMenuLicenses.filter(({ id }) => id !== LicenseUri.CC0).length;

    expect(softwareLicenseCount).toBe(14);
    expect(licenseDeeds).toHaveLength(10);
  });

  test('Leaves CC0 to the Creative Commons deed', () => {
    const cc0 = licenses.find((license) => license.id === LicenseUri.CC0);

    expect(licenseDeeds.some((deed) => deed.licenseId === LicenseUri.CC0)).toBe(false);
    expect(cc0?.link).toBe('https://creativecommons.org/publicdomain/zero/1.0/deed.no');
  });

  test('Points every menu license at a link', () => {
    sourceCodeMenuLicenses.forEach((license) => {
      expect(license.link).toBeTruthy();
    });
  });

  test('Points every deed license at its own deed page', () => {
    licenseDeeds.forEach((deed) => {
      const license = licenses.find(({ id }) => id === deed.licenseId);

      expect(license?.link).toBe(`/license/${deed.slug}`);
    });
  });
});

describe('The deed translations', () => {
  test('Names and explains every rule, so no deed renders a raw key', () => {
    Object.values(LicenseRule).forEach((rule) => {
      expect(nbTranslations.licenses.rules[rule].label).toBeTruthy();
      expect(nbTranslations.licenses.rules[rule].description).toBeTruthy();
    });
  });

  test('Has a heading for every rule group', () => {
    Object.values(LicenseRuleGroup).forEach((group) => {
      expect(nbTranslations.licenses.deed[group]).toBeTruthy();
    });
  });

  test('Has a note for every version scope', () => {
    Object.values(LicenseVersionNote).forEach((versionNote) => {
      expect(nbTranslations.licenses.deed.version_note[versionNote]).toBeTruthy();
    });
  });

  test('Explains no rule the deeds never use', () => {
    const translatedRules = Object.keys(nbTranslations.licenses.rules);

    expect(translatedRules.sort()).toEqual(Object.values(LicenseRule).sort());
  });
});

describe('getLicenseDeed()', () => {
  test('Finds the deed for a known slug', () => {
    expect(getLicenseDeed(LicenseDeedSlug.GPL_3_0)?.licenseId).toBe(LicenseUri.GPL_3_0_or_later);
  });

  test('Serves one deed to both variants of a GPL-family license', () => {
    const orLater = licenses.find(({ id }) => id === LicenseUri.GPL_3_0_or_later);
    const only = licenses.find(({ id }) => id === LicenseUri.GPL_3_0_only);

    expect(only?.link).toBe(orLater?.link);
    expect(getLicenseDeed(LicenseDeedSlug.GPL_3_0)?.hasVersionVariants).toBe(true);
  });

  test('Titles a shared deed without the version scope that tells the variants apart', () => {
    const deed = getLicenseDeed(LicenseDeedSlug.GPL_2_0);
    const license = licenses.find(({ id }) => id === deed?.licenseId);

    expect(license?.name).toBe('GNU GPL v2 eller senere');
    expect(license?.shortName).toBe('GNU GPL v2');
  });

  test('Leaves single-version licenses without a version note', () => {
    expect(getLicenseDeed(LicenseDeedSlug.MIT)?.hasVersionVariants).toBeUndefined();
  });

  test('Returns null for a slug we serve no deed for', () => {
    expect(getLicenseDeed('cc0-1.0')).toBe(null);
    expect(getLicenseDeed('gpl-3.0-only')).toBe(null);
    expect(getLicenseDeed(undefined)).toBe(null);
  });
});
