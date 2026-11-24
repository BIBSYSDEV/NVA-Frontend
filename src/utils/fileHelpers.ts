import { AssociatedFile, FileAllowedOperation } from '../types/associatedArtifact.types';
import { licenses, LicenseUri } from '../types/license.types';

export const hasFileAccessRight = (file: AssociatedFile, operation: FileAllowedOperation) => {
  return file.allowedOperations?.includes(operation) ?? false;
};

/**
 * Whether the user may edit a file's metadata, which is what decides whether the form disables its fields.
 * @param file File on the registration.
 * @param userMayEditImportCandidateFiles Whether the user holds the internal importer role and the document is an
 * import candidate. That is the one case where the form leaves the fields editable regardless.
 * @returns True when the form lets the user change the file's metadata.
 */
export const userAllowedToEditFileMetadata = (file: AssociatedFile, userMayEditImportCandidateFiles = false) =>
  userMayEditImportCandidateFiles || hasFileAccessRight(file, 'write-metadata');

/**
 * Whether a string value points to a given license.
 * @param value Value to check, which might not be a URL at all.
 * @param licenseUri Identifier of a license in our vocabulary, compared against.
 * @returns True when the two denote the same license, ignoring scheme, casing, trailing slash and the
 * .html suffix on the SPDX pages.
 */
const isEqualToLicenseUri = (value: string | null, licenseUri: LicenseUri) => {
  if (!value) {
    return false;
  }
  if (value === licenseUri) {
    return true;
  }
  try {
    const licenseUrl = new URL(licenseUri);
    const valueUrl = new URL(value);

    if (licenseUrl.hostname === valueUrl.hostname) {
      return comparablePathname(licenseUrl.pathname) === comparablePathname(valueUrl.pathname);
    }
  } catch {
    // Returning false keeps getLicenseData returning null for it, rather than throwing while a file row renders.
  }
  return false;
};

/**
 * Normalises a license URI path so values that denote the same license still match. SPDX serves each
 * license at both /licenses/MIT and /licenses/MIT.html, and imported values may use either.
 * @param pathname Path part of a license URI.
 * @returns The path without a trailing slash or .html suffix, in lower case.
 */
const comparablePathname = (pathname: string) => {
  const withoutTrailingSlash = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const withoutHtmlSuffix = withoutTrailingSlash.replace(/\.html$/i, '');

  return withoutHtmlSuffix.toLowerCase();
};

export const getLicenseData = (value: string | null) => {
  if (!value) {
    return null;
  }
  const license = licenses.find(({ id }) => isEqualToLicenseUri(value, id));
  return license ?? null;
};
