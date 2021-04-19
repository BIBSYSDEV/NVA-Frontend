import deepmerge, { Options } from 'deepmerge';
import { FormikErrors, FormikTouched, FormikValues, getIn } from 'formik';
import { HighestTouchedTab } from '../pages/registration/RegistrationForm';
import { Contributor } from '../types/contributor.types';
import { File } from '../types/file.types';
import {
  ContributorFieldNames,
  DescriptionFieldNames,
  FileFieldNames,
  PublicationType,
  ResourceFieldNames,
  SpecificContributorFieldNames,
  SpecificFileFieldNames,
} from '../types/publicationFieldNames';
import { Registration, RegistrationTab } from '../types/registration.types';

export interface TabErrors {
  [RegistrationTab.Description]: string[];
  [RegistrationTab.ResourceType]: string[];
  [RegistrationTab.Contributors]: string[];
  [RegistrationTab.FilesAndLicenses]: string[];
}

const getErrorMessages = (fieldNames: string[], errors: FormikErrors<unknown>, touched?: FormikTouched<unknown>) => {
  if (!Object.keys(errors).length || !fieldNames.length) {
    return [];
  }

  const errorFieldNames = fieldNames.filter((fieldName) => {
    const fieldHasError = !!getIn(errors, fieldName);
    const fieldIsTouched = touched === undefined || !!getIn(touched, fieldName); // Ignore touched if not included as argument
    return fieldHasError && fieldIsTouched;
  });

  const errorMessages = errorFieldNames.map((errorFieldName) => getIn(errors, errorFieldName));
  // Keep only messages with type string, since they cannot be displayed properly otherwise
  const filteredErrorMessages = errorMessages.filter((errorMessage) => typeof errorMessage === 'string');
  const uniqueErrorMessages = [...new Set(filteredErrorMessages)];
  return uniqueErrorMessages;
};

export const getTabErrors = (values: FormikValues, errors: FormikErrors<unknown>, touched?: FormikTouched<unknown>) => {
  const tabErrors: TabErrors = {
    [RegistrationTab.Description]: getErrorMessages(descriptionFieldNames, errors, touched),
    [RegistrationTab.ResourceType]: getErrorMessages(resourceFieldNames, errors, touched),
    [RegistrationTab.Contributors]: getErrorMessages(
      getAllContributorFields(values.entityDescription.contributors),
      errors,
      touched
    ),
    [RegistrationTab.FilesAndLicenses]: getErrorMessages(getAllFileFields(values.fileSet.files), errors, touched),
  };
  return tabErrors;
};

export const getFirstErrorTab = (tabErrors?: TabErrors) =>
  tabErrors
    ? tabErrors[RegistrationTab.Description].length > 0
      ? RegistrationTab.Description
      : tabErrors[RegistrationTab.ResourceType].length > 0
      ? RegistrationTab.ResourceType
      : tabErrors[RegistrationTab.Contributors].length > 0
      ? RegistrationTab.Contributors
      : tabErrors[RegistrationTab.FilesAndLicenses].length > 0
      ? RegistrationTab.FilesAndLicenses
      : -1
    : -1;

const descriptionFieldNames = Object.values(DescriptionFieldNames);
const resourceFieldNames = Object.values(ResourceFieldNames);

const getAllFileFields = (files: File[]): string[] => {
  const fieldNames: string[] = [];
  if (files.length === 0) {
    fieldNames.push(FileFieldNames.FILES);
  } else {
    files.forEach((file, index) => {
      const baseFieldName = `${FileFieldNames.FILES}[${index}]`;
      fieldNames.push(`${baseFieldName}.${SpecificFileFieldNames.ADMINISTRATIVE_AGREEMENT}`);
      if (!file.administrativeAgreement) {
        fieldNames.push(`${baseFieldName}.${SpecificFileFieldNames.PUBLISHER_AUTHORITY}`);
        fieldNames.push(`${baseFieldName}.${SpecificFileFieldNames.EMBARGO_DATE}`);
        fieldNames.push(`${baseFieldName}.${SpecificFileFieldNames.LICENSE}`);
      }
    });
  }
  return fieldNames;
};

const getAllContributorFields = (contributors: Contributor[]): string[] => {
  const fieldNames: string[] = [ContributorFieldNames.CONTRIBUTORS];

  contributors.forEach((_, index) => {
    const baseFieldName = `${ContributorFieldNames.CONTRIBUTORS}[${index}]`;
    fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.SEQUENCE}`);
    fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.CORRESPONDING}`);
  });
  return fieldNames;
};

const touchedDescriptionTabFields: FormikTouched<Registration> = {
  entityDescription: {
    abstract: true,
    date: {
      day: true,
      month: true,
      year: true,
    },
    description: true,
    language: true,
    mainTitle: true,
    tags: true,
  },
};

const touchedResourceTabFields = (publicationType: PublicationType | ''): FormikTouched<unknown> => {
  switch (publicationType) {
    case PublicationType.PUBLICATION_IN_JOURNAL:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              title: true,
            },
            publicationInstance: {
              type: true,
              articleNumber: true,
              issue: true,
              pages: {
                begin: true,
                end: true,
              },
              peerReviewed: true,
              volume: true,
              corrigendumFor: true,
            },
          },
        },
      };
    case PublicationType.DEGREE:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              publisher: true,
            },
            publicationInstance: {
              type: true,
            },
          },
        },
      };
    case PublicationType.REPORT:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              publisher: true,
            },
            publicationInstance: {
              type: true,
            },
          },
        },
      };
    case PublicationType.BOOK:
      return {
        entityDescription: {
          npiSubjectHeading: true,
          reference: {
            publicationContext: {
              type: true,
              publisher: true,
              isbnList: true,
            },
            publicationInstance: {
              type: true,
              pages: {
                pages: true,
              },
            },
          },
        },
      };
    case PublicationType.CHAPTER:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              linkedContext: true,
            },
            publicationInstance: {
              type: true,
            },
          },
        },
      };
    default:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
            },
            publicationInstance: {
              type: true,
            },
          },
        },
      };
  }
};

const touchedContributorTabFields = (contributors: Contributor[]): FormikTouched<Registration> => ({
  entityDescription: {
    contributors: contributors.map((_) => ({
      correspondingAuthor: true,
      sequence: true,
    })),
  },
});

const touchedFilesTabFields = (files: File[]): FormikTouched<Registration> => ({
  fileSet: {
    files: files.map((file) => ({
      administrativeAgreement: true,
      publisherAuthority: !file.administrativeAgreement,
      embargoDate: !file.administrativeAgreement,
      license: !file.administrativeAgreement,
    })),
  },
});

const overwriteArrayMerge = (destinationArray: unknown[], sourceArray: unknown[], options?: Options) => sourceArray;

export const mergeTouchedFields = (touchedArray: FormikTouched<Registration>[]) =>
  deepmerge.all(touchedArray, { arrayMerge: overwriteArrayMerge });

export const getTouchedTabFields = (
  tabToTouch: HighestTouchedTab,
  values: Registration
): FormikTouched<Registration> => {
  const tabFields = {
    [RegistrationTab.Description]: () => touchedDescriptionTabFields,
    [RegistrationTab.ResourceType]: () =>
      touchedResourceTabFields(values.entityDescription.reference.publicationContext.type),
    [RegistrationTab.Contributors]: () => touchedContributorTabFields(values.entityDescription.contributors),
    [RegistrationTab.FilesAndLicenses]: () => touchedFilesTabFields(values.fileSet.files),
  };

  // Set all fields on previous tabs to touched
  const fieldsToTouchOnMount = [];
  for (let thisTab = RegistrationTab.Description; thisTab <= tabToTouch; thisTab++) {
    fieldsToTouchOnMount.push(tabFields[thisTab]());
  }
  const mergedFields = mergeTouchedFields(fieldsToTouchOnMount);
  return mergedFields;
};
