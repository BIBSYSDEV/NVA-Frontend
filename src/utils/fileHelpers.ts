import { AssociatedArtifact, AssociatedFile, FileAllowedOperation } from '../types/associatedArtifact.types';
import { licenses, LicenseUri } from '../types/license.types';
import { ResearchDataType } from '../types/publicationFieldNames';

export const hasFileAccessRight = (file: AssociatedFile, operation: FileAllowedOperation) => {
  return file.allowedOperations?.includes(operation) ?? false;
};

/**
 * Whether a string value points to a given license.
 * @param value Value to check, which might not be a URL at all.
 * @param licenseUri Identifier of a license in our vocabulary, compared against.
 * @returns True when the two denote the same license, ignoring scheme, casing and trailing slash.
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
      return (
        removeTrailingSlash(licenseUrl.pathname).toLowerCase() === removeTrailingSlash(valueUrl.pathname).toLowerCase()
      );
    }
  } catch {
    // Returning false keeps getLicenseData returning null for it, rather than throwing while a file row renders.
  }
  return false;
};

const removeTrailingSlash = (value: string) => (value.endsWith('/') ? value.slice(0, -1) : value);

export const getLicenseData = (value: string | null) => {
  if (!value) {
    return null;
  }
  const license = licenses.find(({ id }) => isEqualToLicenseUri(value, id));
  return license ?? null;
};

const activeLicenses = licenses.filter(
  (license) => license.version === 4 || license.id === LicenseUri.CC0 || license.id === LicenseUri.CopyrightAct
);

const inactiveLicenses = licenses.filter((license) => license.version && license.version !== 4);

/**
 * The licenses offered for source code files, in the order they appear. `shortList` is shown by default
 * in the menu and `additional` only after the user expands it; licenses in neither cannot be selected.
 * `helpModal` holds the ones the help modal explains: the -only variants are left out, since they share
 * their explanation with the -or-later variant of the same license.
 */
const sourceCodeMenu = {
  shortList: [
    LicenseUri.MIT,
    LicenseUri.Apache_2_0,
    LicenseUri.GPL_3_0_or_later,
    LicenseUri.BSD_3_Clause,
    LicenseUri.EUPL_1_2,
    LicenseUri.CC0,
  ],
  additional: [
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
  helpModal: [
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
  ],
};

/**
 * Resolves license identifiers to the licenses themselves, keeping the given order.
 * @param licenseUris Identifiers from the menu configuration.
 * @returns The matching licenses, skipping any identifier without a license.
 */
const toLicenses = (licenseUris: LicenseUri[]) =>
  licenseUris.map((uri) => licenses.find((license) => license.id === uri)).filter((license) => !!license);

const sourceCodeShortListLicenses = toLicenses(sourceCodeMenu.shortList);

const sourceCodeAdditionalLicenses = toLicenses(sourceCodeMenu.additional);

const sourceCodeHelpModalLicenses = toLicenses(sourceCodeMenu.helpModal);

/**
 * Whether files on a registration of this category are offered the software licenses rather than the
 * Creative Commons ones.
 * @param publicationInstanceType Category of the registration the file belongs to.
 * @returns True for the source code category.
 */
export const isSourceCodeCategory = (publicationInstanceType?: string) =>
  publicationInstanceType === ResearchDataType.SoftwareSourceCode;

/**
 * Licenses shown by default in the license menu for a file.
 * @param publicationInstanceType Category of the registration the file belongs to.
 * @returns Software licenses for source code, Creative Commons licenses for all other categories.
 */
export const getShortListLicenses = (publicationInstanceType?: string) =>
  isSourceCodeCategory(publicationInstanceType) ? sourceCodeShortListLicenses : activeLicenses;

/**
 * Licenses shown in the license menu only after the user expands it.
 * @param publicationInstanceType Category of the registration the file belongs to.
 * @returns Remaining software licenses for source code, older Creative Commons versions for all other categories.
 */
export const getAdditionalLicenses = (publicationInstanceType?: string) =>
  isSourceCodeCategory(publicationInstanceType) ? sourceCodeAdditionalLicenses : inactiveLicenses;

/**
 * Licenses explained in the license help modal, in the order they are shown there.
 * @param publicationInstanceType Category of the registration the file belongs to.
 * @returns The licenses the modal shows a card for.
 */
export const getHelpModalLicenses = (publicationInstanceType?: string) =>
  isSourceCodeCategory(publicationInstanceType) ? sourceCodeHelpModalLicenses : activeLicenses;

/**
 * Whether a file's license must be cleared because the registration changed to a category whose license
 * menu no longer offers it. A file is left alone when it has no license to clear, when the user lacks
 * the right to edit it, or when the license is still offered.
 * @param associatedArtifact Artifact on the registration. Links and empty artifacts are never affected.
 * @param newPublicationInstanceType Category the registration is changing to.
 * @returns True when the license should be cleared so the user picks a new one.
 */
export const licenseNeedsReset = (associatedArtifact: AssociatedArtifact, newPublicationInstanceType?: string) => {
  // Only files carry a license, and writing an empty string over a missing license would only make the form dirty.
  if (!('license' in associatedArtifact) || !associatedArtifact.license) {
    return false;
  }

  if (!hasFileAccessRight(associatedArtifact, 'write-metadata')) {
    // Clearing a license the user cannot edit would leave the registration invalid with no way to fix it
    return false;
  }

  return !isSelectableLicense(associatedArtifact.license, newPublicationInstanceType);
};

/**
 * Whether a license is offered in the license menu for a category.
 * @param licenseUri Value stored in the file's license field.
 * @param publicationInstanceType Category of the registration the file belongs to.
 * @returns True when the license appears in either menu section for that category.
 */
export const isSelectableLicense = (licenseUri: string | null, publicationInstanceType?: string) => {
  const license = getLicenseData(licenseUri);

  return (
    !!license &&
    [...getShortListLicenses(publicationInstanceType), ...getAdditionalLicenses(publicationInstanceType)].some(
      (selectable) => selectable.id === license.id
    )
  );
};
