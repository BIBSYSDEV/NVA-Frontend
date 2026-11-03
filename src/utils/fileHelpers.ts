import { AssociatedArtifact, AssociatedFile, FileAllowedOperation, FileType } from '../types/associatedArtifact.types';
import { LicenseInfo, licenses, LicenseUri } from '../types/license.types';
import { ResearchDataType } from '../types/publicationFieldNames';

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
export const userMayEditFileMetadata = (file: AssociatedFile, userMayEditImportCandidateFiles = false) =>
  userMayEditImportCandidateFiles || hasFileAccessRight(file, 'write-metadata');

/**
 * Whether an artifact is a file of a type that carries a license.
 * @param associatedArtifact Artifact on the registration, which may be a link or an empty artifact.
 * @returns True when the artifact is a file whose license the user is shown and can act on.
 */
const hasLicenseField = (associatedArtifact: AssociatedArtifact): associatedArtifact is AssociatedFile =>
  associatedArtifact.type === FileType.OpenFile || associatedArtifact.type === FileType.PendingOpenFile;

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

/** Every license the license menu offers for source code, regardless of whether the user must expand the menu to see it. */
const sourceCodeLicenseMenu = [...sourceCodeShortListLicenses, ...sourceCodeAdditionalLicenses];

/** Every license the license menu offers for all other categories, regardless of whether the user must expand the menu. */
const creativeCommonsLicenseMenu = [...activeLicenses, ...inactiveLicenses];

/**
 * Whether a license menu offers a license.
 * @param licenseUri Value stored in the file's license field.
 * @param licenseMenu Licenses that menu offers.
 * @returns True when the menu offers the license.
 */
const isInLicenseMenu = (licenseUri: string | null, licenseMenu: LicenseInfo[]) => {
  const license = getLicenseData(licenseUri);

  return !!license && licenseMenu.some((selectable) => selectable.id === license.id);
};

/**
 * Whether files on a registration of this category are offered the software licenses rather than the
 * Creative Commons ones.
 * @param publicationInstanceType Category of the registration the file belongs to.
 * @returns True for the source code category.
 */
export const isSourceCodeCategory = (publicationInstanceType?: string) =>
  publicationInstanceType === ResearchDataType.SoftwareSourceCode;

/**
 * Whether two categories are offered the same license menu. Source code is offered software licenses and every
 * other category Creative Commons ones, so only a change that crosses that boundary changes the menu.
 * @param publicationInstanceType Category of a registration.
 * @param otherPublicationInstanceType Category to compare it against.
 * @returns True when both categories are offered the same license menu.
 */
export const hasSameLicenseMenu = (publicationInstanceType?: string, otherPublicationInstanceType?: string) =>
  isSourceCodeCategory(publicationInstanceType) === isSourceCodeCategory(otherPublicationInstanceType);

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
 * @param associatedArtifact Artifact on the registration. Only a file with a license field is affected.
 * @param newPublicationInstanceType Category the registration is changing to.
 * @param userMayEditImportCandidateFiles Passed on to {@link userMayEditFileMetadata}, so a license is never
 * cleared in a field the user can't reach.
 * @returns True when the license should be cleared.
 */
export const licenseNeedsReset = (
  associatedArtifact: AssociatedArtifact,
  newPublicationInstanceType?: string,
  userMayEditImportCandidateFiles = false
) => {
  if (!hasLicenseField(associatedArtifact) || !associatedArtifact.license) {
    return false;
  }

  if (!userMayEditFileMetadata(associatedArtifact, userMayEditImportCandidateFiles)) {
    return false;
  }

  return !isCorrectLicenseForCategory(associatedArtifact.license, newPublicationInstanceType);
};

/**
 * Whether both license menus offer a license, so that a file carrying it survives a category change across the
 * source code boundary.
 * @param licenseUri Value stored in the file's license field.
 * @returns True when the license is offered both for source code and for every other category.
 */
const isUniversalLicense = (licenseUri: string) =>
  isInLicenseMenu(licenseUri, creativeCommonsLicenseMenu) && isInLicenseMenu(licenseUri, sourceCodeLicenseMenu);

/**
 * Whether a file's license stops the registration from changing to a category with the other license menu.
 * A license only one of the two menus offers cannot survive that change.
 *
 * @param associatedArtifact Artifact on the registration. Only a file with a license field can lock the menu.
 * @param currentPublicationInstanceType Category the registration has now.
 * @param userMayEditImportCandidateFiles Passed on to {@link userMayEditFileMetadata}.
 * @returns True when the category cannot be changed to one with the other license menu.
 */
export const isLockedOnCorrectLicense = (
  associatedArtifact: AssociatedArtifact,
  currentPublicationInstanceType?: string,
  userMayEditImportCandidateFiles = false
) => {
  if (!hasLicenseField(associatedArtifact) || !associatedArtifact.license) {
    return false;
  }

  if (userMayEditFileMetadata(associatedArtifact, userMayEditImportCandidateFiles)) {
    return false;
  }

  return (
    isCorrectLicenseForCategory(associatedArtifact.license, currentPublicationInstanceType) &&
    !isUniversalLicense(associatedArtifact.license)
  );
};

/**
 * Whether a license is offered in the license menu for a category.
 * @param licenseUri Value stored in the file's license field.
 * @param publicationInstanceType Category of the registration the file belongs to.
 * @returns True when that category's license menu offers the license.
 */
export const isCorrectLicenseForCategory = (licenseUri: string | null, publicationInstanceType?: string) =>
  isInLicenseMenu(
    licenseUri,
    isSourceCodeCategory(publicationInstanceType) ? sourceCodeLicenseMenu : creativeCommonsLicenseMenu
  );
