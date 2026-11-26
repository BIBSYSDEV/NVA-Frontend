import { AssociatedArtifact, AssociatedFile, FileType } from '../types/associatedArtifact.types';
import { LicenseInfo, licenses, LicenseUri } from '../types/license.types';
import { FileFieldNames, ResearchDataType, SpecificFileFieldNames } from '../types/publicationFieldNames';
import { getLicenseData, userAllowedToEditFileMetadata } from './fileHelpers';

const allFileTypes: string[] = Object.values(FileType);

/**
 * Whether an artifact is a file, and so carries a license. Changing a file's availability only writes the file type,
 * so a file that had a license while it was open still holds it as an internal file, and shows it again the moment it is made open.
 * @param associatedArtifact Artifact on the registration, which may be a link or an empty artifact.
 * @returns True when the artifact is a file.
 */
const hasLicenseField = (associatedArtifact: AssociatedArtifact): associatedArtifact is AssociatedFile =>
  allFileTypes.includes(associatedArtifact.type);

/**
 * Whether an artifact is a file whose license the user is shown and can act on. Only the open file types show
 * the license field; the others carry the value without rendering it.
 * @param associatedArtifact Artifact on the registration, which may be a link or an empty artifact.
 * @returns True when the form renders a license field for the artifact.
 */
const showsLicenseField = (associatedArtifact: AssociatedArtifact): associatedArtifact is AssociatedFile =>
  associatedArtifact.type === FileType.OpenFile || associatedArtifact.type === FileType.PendingOpenFile;

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
 * the right to edit it, or when the license is still offered. Every file type is covered, not only the ones showing the license field.
 * @param associatedArtifact Artifact on the registration. Only files are affected.
 * @param newPublicationInstanceType Category the registration is changing to.
 * @param userMayEditImportCandidateFiles Passed on to {@link userAllowedToEditFileMetadata}, so a license is never
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

  if (!userAllowedToEditFileMetadata(associatedArtifact, userMayEditImportCandidateFiles)) {
    return false;
  }

  return !isCorrectLicenseForCategory(associatedArtifact.license, newPublicationInstanceType);
};

/**
 * Field paths for the licenses a category change invalidates, so the form can clear them in one pass.
 * Returns nothing when the change stays within one license menu, since every license then survives it.
 * @param associatedArtifacts Artifacts on the registration, in the order the form holds them. Their index
 * is what ties a path back to its file, so the array must not be filtered before it is passed in.
 * @param currentPublicationInstanceType Category the registration has now.
 * @param newPublicationInstanceType Category the registration is changing to.
 * @param userMayEditImportCandidateFiles Passed on to {@link licenseNeedsReset}.
 * @returns Formik field paths of the licenses to clear.
 */
export const getLicenseFieldsToReset = (
  associatedArtifacts: AssociatedArtifact[],
  currentPublicationInstanceType?: string,
  newPublicationInstanceType?: string,
  userMayEditImportCandidateFiles = false
): string[] => {
  if (hasSameLicenseMenu(currentPublicationInstanceType, newPublicationInstanceType)) {
    return [];
  }

  return associatedArtifacts.flatMap((associatedArtifact, index) =>
    licenseNeedsReset(associatedArtifact, newPublicationInstanceType, userMayEditImportCandidateFiles)
      ? [`${FileFieldNames.AssociatedArtifacts}[${index}].${SpecificFileFieldNames.License}`]
      : []
  );
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
 * A license only one of the two menus offers cannot survive that change. Only files showing the license field can lock the category.
 * @param associatedArtifact Artifact on the registration. Only a file showing a license can lock the menu.
 * @param currentPublicationInstanceType Category the registration has now.
 * @param userMayEditImportCandidateFiles Passed on to {@link userAllowedToEditFileMetadata}.
 * @returns True when the category cannot be changed to one with the other license menu.
 */
export const isLockedOnCorrectLicense = (
  associatedArtifact: AssociatedArtifact,
  currentPublicationInstanceType?: string,
  userMayEditImportCandidateFiles = false
) => {
  if (!showsLicenseField(associatedArtifact) || !associatedArtifact.license) {
    return false;
  }

  if (userAllowedToEditFileMetadata(associatedArtifact, userMayEditImportCandidateFiles)) {
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
