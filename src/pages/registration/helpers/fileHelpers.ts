import { AssociatedFile, FileType } from '../../../types/associatedArtifact.types';
import { Registration } from '../../../types/registration.types';
import { User } from '../../../types/user.types';
import {
  isDegree,
  isEmbargoed,
  isOpenFile,
  isPendingOpenFile,
  userHasAccessRight,
} from '../../../utils/registration-helpers';

export const userCanEditFile = (file: AssociatedFile, user: User | null, registration: Registration) => {
  if (!user) {
    return false;
  }

  const isImportFile = file.uploadDetails?.type === 'ImportUploadDetails';
  if (isImportFile) {
    // Publishing curator can edit imported files
    return !!user?.isPublishingCurator;
  }

  if (registration.type === 'ImportCandidate') {
    // Importer can change file before the candidate is imported
    return !!user?.isInternalImporter;
  }

  const userIsOnSameInstitutionAsFileUploader =
    file.uploadDetails?.type === 'UserUploadDetails' &&
    file.uploadDetails?.uploadedBy &&
    user?.nvaUsername &&
    file.uploadDetails.uploadedBy.split('@').pop() === user.nvaUsername.split('@').pop();

  const isProtectedDegree = isDegree(registration.entityDescription?.reference?.publicationInstance.type);
  if (isProtectedDegree) {
    // Files on degree types require thesis curator rights to update files
    if (isEmbargoed(file.embargoDate) && isOpenFile(file)) {
      return !!user?.isEmbargoThesisCurator && userIsOnSameInstitutionAsFileUploader;
    } else {
      return !!user?.isThesisCurator && userIsOnSameInstitutionAsFileUploader;
    }
  }

  const isPublishingCuratorForUploader =
    userHasAccessRight(registration, 'update-including-files') &&
    !!user?.isPublishingCurator &&
    userIsOnSameInstitutionAsFileUploader;

  const isPendingFile = isPendingOpenFile(file) || file.type === FileType.PendingInternalFile;

  if (isPendingFile) {
    const isFileUploader =
      user?.nvaUsername &&
      file.uploadDetails?.type === 'UserUploadDetails' &&
      file.uploadDetails.uploadedBy === user.nvaUsername;
    if (isFileUploader) {
      // Uploader can update their own files until it is approved by a curator
      return true;
    }

    if (isPublishingCuratorForUploader) {
      // Publishing curator can edit files uploaded by users from the same institution
      return true;
    }
    return false;
  }

  const isApprovedFile = isOpenFile(file) || file.type === FileType.InternalFile;
  if (isApprovedFile) {
    return isPublishingCuratorForUploader;
  }

  return false;
};