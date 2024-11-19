import { describe, expect, test } from 'vitest';
import { AssociatedFile, emptyFile } from '../../../types/associatedArtifact.types';
import { DegreeType } from '../../../types/publicationFieldNames';
import { emptyRegistration, Registration } from '../../../types/registration.types';
import { User } from '../../../types/user.types';
import { userCanEditFile } from './fileHelpers';

describe('userCanEditFile', () => {
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

  test('returnerer false når brukeren er null', () => {
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
});
