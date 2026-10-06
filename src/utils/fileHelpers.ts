import { AssociatedFile, FileAllowedOperation } from '../types/associatedArtifact.types';
import { licenses, LicenseUri } from '../types/license.types';
import { ResearchDataType } from '../types/publicationFieldNames';

export const hasFileAccessRight = (file: AssociatedFile, operation: FileAllowedOperation) => {
  return file.allowedOperations?.includes(operation) ?? false;
};

const isEqualLicenseUri = (uri1: string | null, uri2: string | null) => {
  if (!uri1 || !uri2) {
    return false;
  }
  if (uri1 === uri2) {
    return true;
  }
  const urlObj1 = new URL(uri1);
  const urlObj2 = new URL(uri2);

  if (urlObj1.hostname === urlObj2.hostname) {
    return removeTrailingSlash(urlObj1.pathname).toLowerCase() === removeTrailingSlash(urlObj2.pathname).toLowerCase();
  }
  return false;
};

const removeTrailingSlash = (value: string) => (value.endsWith('/') ? value.slice(0, -1) : value);

export const getLicenseData = (licenseUri: string | null) => {
  if (!licenseUri) {
    return null;
  }
  const license = licenses.find((l) => isEqualLicenseUri(l.id, licenseUri));
  return license ?? null;
};

export const activeLicenses = licenses.filter(
  (license) => license.version === 4 || license.id === LicenseUri.CC0 || license.id === LicenseUri.CopyrightAct
);

const inactiveLicenses = licenses.filter((license) => license.version && license.version !== 4);

/**
 * The licenses offered for source code files, in the order they appear in the menu. The short list is
 * shown by default; the full list only after the user expands the menu. Licenses not listed here cannot
 * be selected for source code.
 */
const sourceCodeMenu = {
  short: [
    LicenseUri.MIT,
    LicenseUri.Apache_2_0,
    LicenseUri.GPL_3_0_or_later,
    LicenseUri.BSD_3_Clause,
    LicenseUri.EUPL_1_2,
    LicenseUri.CC0,
  ],
  full: [
    LicenseUri.BSD_2_Clause,
    LicenseUri.GPL_2_0_or_later,
    LicenseUri.AGPL_3_0_or_later,
    LicenseUri.LGPL_3_0_or_later,
    LicenseUri.MPL_2_0,
    LicenseUri.GPL_2_0_only,
    LicenseUri.GPL_3_0_only,
    LicenseUri.AGPL_3_0_only,
    LicenseUri.LGPL_3_0_only,
  ],
};

/**
 * Resolves license identifiers to the licenses themselves, keeping the given order.
 * @param licenseUris Identifiers from the menu configuration.
 * @returns The matching licenses, skipping any identifier without a license.
 */
const toLicenses = (licenseUris: LicenseUri[]) =>
  licenseUris.map((uri) => licenses.find((license) => license.id === uri)).filter((license) => !!license);

const sourceCodeShortListLicenses = toLicenses(sourceCodeMenu.short);

const sourceCodeFullListLicenses = toLicenses(sourceCodeMenu.full);

/**
 * Licenses shown by default in the license menu for a file.
 * @param publicationInstanceType Category of the registration the file belongs to.
 * @returns Software licenses for source code, Creative Commons licenses for all other categories.
 */
export const getShortListLicenses = (publicationInstanceType?: string) =>
  publicationInstanceType === ResearchDataType.SoftwareSourceCode ? sourceCodeShortListLicenses : activeLicenses;

/**
 * Licenses shown in the license menu only after the user expands it.
 * @param publicationInstanceType Category of the registration the file belongs to.
 * @returns Remaining software licenses for source code, older Creative Commons versions for all other categories.
 */
export const getFullListLicenses = (publicationInstanceType?: string) =>
  publicationInstanceType === ResearchDataType.SoftwareSourceCode ? sourceCodeFullListLicenses : inactiveLicenses;

// The software licenses from both menu sections, followed by CC0. Only the software licenses carry an
// spdxId, so that is also what separates them from CC0, which is shown last.
const sourceCodeHelpModalLicenses = [
  ...toLicenses([...sourceCodeMenu.short, ...sourceCodeMenu.full]).filter(
    (license) => license.spdxId && !license.spdxId.endsWith('-only')
  ),
  ...toLicenses([LicenseUri.CC0]),
];

/**
 * Licenses explained in the license help modal, in the order they are shown there. For source code the
 * -only variants are left out, since they share their explanation with the -or-later variant of the
 * same license and would otherwise appear twice with identical text.
 * @param publicationInstanceType Category of the registration the file belongs to.
 * @returns The licenses the modal shows a card for.
 */
export const getHelpModalLicenses = (publicationInstanceType?: string) =>
  publicationInstanceType === ResearchDataType.SoftwareSourceCode ? sourceCodeHelpModalLicenses : activeLicenses;
