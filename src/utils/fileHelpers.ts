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

const sourceCodeShortListLicenses = licenses.filter((license) => license.sourceCodeMenuSection === 'short');

const sourceCodeFullListLicenses = licenses.filter((license) => license.sourceCodeMenuSection === 'full');

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

/**
 * Detects whether files on the same registration mix the -only and -or-later variants of a software
 * license. This is permitted, but is usually a registration mistake, so the user should be warned.
 * @param files Files on the registration.
 * @returns True when at least one file has an -only license and at least one other has an -or-later license.
 */
export const hasMixedLicenseVersionScopes = (files: AssociatedFile[]) => {
  const spdxIds = files
    .map((file) => getLicenseData(file.license)?.spdxId)
    .filter((spdxId): spdxId is string => !!spdxId);

  const hasOnlyLicense = spdxIds.some((spdxId) => spdxId.endsWith('-only'));
  const hasOrLaterLicense = spdxIds.some((spdxId) => spdxId.endsWith('-or-later'));

  return hasOnlyLicense && hasOrLaterLicense;
};
