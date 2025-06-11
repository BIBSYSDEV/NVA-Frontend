import { AssociatedFile, FileAllowedOperation } from '../types/associatedArtifact.types';
import { licenses, LicenseUri } from '../types/license.types';

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
