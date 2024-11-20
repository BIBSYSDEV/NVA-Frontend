import { describe, expect, test } from 'vitest';
import { AssociatedFile, emptyFile, FileType } from '../../../types/associatedArtifact.types';
import { DegreeType } from '../../../types/publicationFieldNames';
import { emptyRegistration, Registration } from '../../../types/registration.types';
import { User } from '../../../types/user.types';
import { userCanEditFile } from './fileHelpers';

const emptyUser: User = {
  nationalIdNumber: '',
  familyName: '',
  givenName: '',
  feideId: '',
  isAppAdmin: false,
  isInternalImporter: false,
  isDoiCurator: false,
  isPublishingCurator: false,
  isSupportCurator: false,
  isThesisCurator: false,
  isEmbargoThesisCurator: false,
  isInstitutionAdmin: false,
  isCreator: false,
  isEditor: false,
  isNviCurator: false,
  roles: [],
  nvaUsername: '',
  allowedCustomers: [],
};

describe('userCanEditFile', () => {
  test('returns false when the user is null', () => {
    const result = userCanEditFile(emptyFile, null, emptyRegistration);
    expect(result).toBe(false);
  });

  test('returns true for an imported file if the user is a publishing curator', () => {
    const file: AssociatedFile = {
      ...emptyFile,
      uploadDetails: { type: 'ImportUploadDetails', source: '', archive: '', uploadedDate: '' },
    };
    const user: User = { ...emptyUser, isPublishingCurator: true };
    const result = userCanEditFile(file, user, emptyRegistration);
    expect(result).toBe(true);
  });

  test('returns false for an imported file if the user is not a publishing curator', () => {
    const file: AssociatedFile = {
      ...emptyFile,
      uploadDetails: { type: 'ImportUploadDetails', source: '', archive: '', uploadedDate: '' },
    };
    const user: User = { ...emptyUser, isPublishingCurator: false };
    const result = userCanEditFile(file, user, emptyRegistration);
    expect(result).toBe(false);
  });

  test('returns true for an import candidate if the user is an internal importer', () => {
    const registration: Registration = { ...emptyRegistration, type: 'ImportCandidate' };
    const user: User = { ...emptyUser, isInternalImporter: true };
    const result = userCanEditFile(emptyFile, user, registration);
    expect(result).toBe(true);
  });

  test('returns false for an import candidate if the user is not an internal importer', () => {
    const registration: Registration = { ...emptyRegistration, type: 'ImportCandidate' };
    const user: User = { ...emptyUser, isInternalImporter: false };
    const result = userCanEditFile(emptyFile, user, registration);
    expect(result).toBe(false);
  });

  test('returns true if the result is a degree and the user is a thesis curator that belongs to the same institution as the file uploader', () => {
    const file: AssociatedFile = {
      ...emptyFile,
      uploadDetails: { type: 'UserUploadDetails', uploadedBy: '123@1.0.0.0', uploadedDate: '' },
    };
    const user: User = { ...emptyUser, isThesisCurator: true, nvaUsername: '123@1.0.0.0' };
    const registration: Registration = {
      entityDescription: {
        reference: { publicationInstance: { type: DegreeType.Bachelor as any } as any } as any,
      } as any,
    } as Registration;

    const result = userCanEditFile(file, user, registration);
    expect(result).toBe(true);
  });

  test('returns false if the result is a degree and the user is a publishing curator that belongs to the same institution as the file uploader', () => {
    const file: AssociatedFile = {
      ...emptyFile,
      uploadDetails: { type: 'UserUploadDetails', uploadedBy: '123@1.0.0.0', uploadedDate: '' },
    };
    const user: User = { ...emptyUser, isPublishingCurator: true, nvaUsername: '123@1.0.0.0' };
    const registration: Registration = {
      entityDescription: {
        reference: { publicationInstance: { type: DegreeType.Bachelor as any } as any } as any,
      } as any,
    } as Registration;

    const result = userCanEditFile(file, user, registration);
    expect(result).toBe(false);
  });

  test('returns false if the result is a degree and the user is a thesis curator that belongs to another institution than the file uploader', () => {
    const file: AssociatedFile = {
      ...emptyFile,
      uploadDetails: { type: 'UserUploadDetails', uploadedBy: '123@1.0.0.0', uploadedDate: '' },
    };
    const user: User = { ...emptyUser, isThesisCurator: true, nvaUsername: '123@2.0.0.0' };
    const registration: Registration = {
      entityDescription: {
        reference: { publicationInstance: { type: DegreeType.Bachelor as any } as any } as any,
      } as any,
    } as Registration;

    const result = userCanEditFile(file, user, registration);
    expect(result).toBe(false);
  });

  test('returns false for an embargoed thesis file if the user does not have the required rights', () => {
    const currentYear = new Date().getFullYear();
    const file: AssociatedFile = {
      ...emptyFile,
      type: FileType.OpenFile,
      embargoDate: new Date(currentYear + 1, 0, 1),
      uploadDetails: { type: 'UserUploadDetails', uploadedBy: '123@1.0.0.0', uploadedDate: '' },
    };
    const user: User = {
      ...emptyUser,
      isPublishingCurator: true,
      isThesisCurator: true,
      isEmbargoThesisCurator: false,
      nvaUsername: '123@1.0.0.0',
    };
    const registration: Registration = {
      entityDescription: {
        reference: { publicationInstance: { type: DegreeType.Bachelor as any } as any } as any,
      } as any,
    } as Registration;

    const result = userCanEditFile(file, user, registration);
    expect(result).toBe(false);
  });

  test('returns true for an embargoed thesis file if the user is EmbargoThesisCurator', () => {
    const currentYear = new Date().getFullYear();
    const file: AssociatedFile = {
      ...emptyFile,
      type: FileType.OpenFile,
      embargoDate: new Date(currentYear + 1, 0, 1),
      uploadDetails: { type: 'UserUploadDetails', uploadedBy: '123@1.0.0.0', uploadedDate: '' },
    };
    const user: User = { ...emptyUser, isEmbargoThesisCurator: true, nvaUsername: '123@1.0.0.0' };
    const registration: Registration = {
      entityDescription: {
        reference: { publicationInstance: { type: DegreeType.Bachelor as any } as any } as any,
      } as any,
    } as Registration;

    const result = userCanEditFile(file, user, registration);
    expect(result).toBe(true);
  });

  test('returns true for a pending file if the user is the uploader', () => {
    const file: AssociatedFile = {
      ...emptyFile,
      uploadDetails: { type: 'UserUploadDetails', uploadedBy: '123@1.0.0.0', uploadedDate: '' },
      type: FileType.PendingOpenFile,
    };
    const user: User = { ...emptyUser, nvaUsername: '123@1.0.0.0' };

    const result = userCanEditFile(file, user, emptyRegistration);
    expect(result).toBe(true);
  });

  test('returns true for a rejected file if the user is the uploader', () => {
    const file: AssociatedFile = {
      ...emptyFile,
      uploadDetails: { type: 'UserUploadDetails', uploadedBy: '123@1.0.0.0', uploadedDate: '' },
      type: FileType.RejectedFile,
    };
    const user: User = { ...emptyUser, nvaUsername: '123@1.0.0.0' };

    const result = userCanEditFile(file, user, emptyRegistration);
    expect(result).toBe(true);
  });

  test('returns false for a pending file if the user is not the uploader', () => {
    const file: AssociatedFile = {
      ...emptyFile,
      uploadDetails: { type: 'UserUploadDetails', uploadedBy: '123@1.0.0.0', uploadedDate: '' },
      type: FileType.PendingOpenFile,
    };
    const user: User = { ...emptyUser, nvaUsername: '1234@1.0.0.0' };

    const result = userCanEditFile(file, user, emptyRegistration);
    expect(result).toBe(false);
  });

  test('returns false for an open file if the user is the uploader', () => {
    const file: AssociatedFile = {
      ...emptyFile,
      uploadDetails: { type: 'UserUploadDetails', uploadedBy: '123@1.0.0.0', uploadedDate: '' },
      type: FileType.OpenFile,
    };
    const user: User = { ...emptyUser, nvaUsername: '123@1.0.0.0' };

    const result = userCanEditFile(file, user, emptyRegistration);
    expect(result).toBe(false);
  });

  test('returns false for a file if the user is not a publishing curator for the uploader', () => {
    const file: AssociatedFile = {
      ...emptyFile,
      uploadDetails: { type: 'UserUploadDetails', uploadedBy: '123@1.0.0.0', uploadedDate: '' },
      type: FileType.PendingOpenFile,
    };
    const user: User = { ...emptyUser, isPublishingCurator: true, nvaUsername: '123@2.0.0.0' };

    const result = userCanEditFile(file, user, emptyRegistration);
    expect(result).toBe(false);
  });

  test('returns true for a file if the user is a publishing curator for the uploader', () => {
    const file: AssociatedFile = {
      ...emptyFile,
      uploadDetails: { type: 'UserUploadDetails', uploadedBy: '123@1.0.0.0', uploadedDate: '' },
      type: FileType.OpenFile,
    };
    const user: User = { ...emptyUser, isPublishingCurator: true, nvaUsername: '123@1.0.0.0' };

    const result = userCanEditFile(file, user, emptyRegistration);
    expect(result).toBe(false);
  });

  test('returns true for a file that lacks upload details', () => {
    const file: AssociatedFile = {
      ...emptyFile,
      type: FileType.PendingOpenFile,
    };

    const result = userCanEditFile(file, emptyUser, emptyRegistration);
    expect(result).toBe(true);
  });
});
