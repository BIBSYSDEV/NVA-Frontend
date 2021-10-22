import deepmerge, { Options } from 'deepmerge';
import { FormikErrors, FormikTouched, getIn } from 'formik';
import { HighestTouchedTab } from '../pages/registration/RegistrationForm';
import { Contributor } from '../types/contributor.types';
import { File, FileSet } from '../types/file.types';
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
import { getMainRegistrationType } from './registration-helpers';

export interface TabErrors {
  [RegistrationTab.Description]: string[];
  [RegistrationTab.ResourceType]: string[];
  [RegistrationTab.Contributors]: string[];
  [RegistrationTab.FilesAndLicenses]: string[];
}

const getErrorMessages = (
  fieldNames: string[],
  errors: FormikErrors<Registration>,
  touched?: FormikTouched<Registration>
) => {
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

export const getTabErrors = (
  values: Registration,
  errors: FormikErrors<Registration>,
  touched?: FormikTouched<Registration>
) => {
  const tabErrors: TabErrors = {
    [RegistrationTab.Description]: getErrorMessages(descriptionFieldNames, errors, touched),
    [RegistrationTab.ResourceType]: getErrorMessages(resourceFieldNames, errors, touched),
    [RegistrationTab.Contributors]: getErrorMessages(
      getAllContributorFields(values.entityDescription?.contributors ?? []),
      errors,
      touched
    ),
    [RegistrationTab.FilesAndLicenses]: getErrorMessages(
      getAllFileFields(values.fileSet?.files ?? []),
      errors,
      touched
    ),
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
    fieldNames.push(FileFieldNames.Files);
    fieldNames.push(FileFieldNames.FileSet);
  } else {
    files.forEach((file, index) => {
      const baseFieldName = `${FileFieldNames.Files}[${index}]`;
      fieldNames.push(`${baseFieldName}.${SpecificFileFieldNames.AdministrativeAgreement}`);
      if (!file.administrativeAgreement) {
        fieldNames.push(`${baseFieldName}.${SpecificFileFieldNames.PublisherAuthority}`);
        fieldNames.push(`${baseFieldName}.${SpecificFileFieldNames.EmbargoDate}`);
        fieldNames.push(`${baseFieldName}.${SpecificFileFieldNames.License}`);
      }
    });
  }
  return fieldNames;
};

const getAllContributorFields = (contributors: Contributor[]): string[] => {
  const fieldNames: string[] = [ContributorFieldNames.Contributors];

  contributors.forEach((_, index) => {
    const baseFieldName = `${ContributorFieldNames.Contributors}[${index}]`;
    fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.Sequence}`);
    fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.Corresponding}`);
  });
  return fieldNames;
};

const touchedDescriptionTabFields: FormikTouched<unknown> = {
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

const touchedResourceTabFields = (instanceType: string): FormikTouched<unknown> => {
  const mainType = getMainRegistrationType(instanceType);

  switch (mainType) {
    case PublicationType.PublicationInJournal:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              id: true,
            },
            publicationInstance: {
              type: true,
              articleNumber: true,
              issue: true,
              pages: {
                begin: true,
                end: true,
              },
              volume: true,
              corrigendumFor: true,
              contentType: true,
              peerReviewed: true,
            },
          },
        },
      };
    case PublicationType.Degree:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              publisher: { id: true },
              series: { id: true },
            },
            publicationInstance: {
              type: true,
            },
          },
        },
      };
    case PublicationType.Report:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              publisher: { id: true },
              series: { id: true },
              isbnList: [true],
            },
            publicationInstance: {
              type: true,
            },
          },
        },
      };
    case PublicationType.Book:
      return {
        entityDescription: {
          npiSubjectHeading: true,
          reference: {
            publicationContext: {
              type: true,
              publisher: { id: true },
              series: { id: true },
              isbnList: [true],
            },
            publicationInstance: {
              type: true,
              pages: {
                pages: true,
              },
              contentType: true,
              peerReviewed: true,
            },
          },
        },
      };
    case PublicationType.Chapter:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              partOf: true,
            },
            publicationInstance: {
              type: true,
              contentType: true,
              peerReviewed: true,
            },
          },
        },
      };
    case PublicationType.Presentation:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              // TODO: Add agent,
              label: true,
              place: {
                label: true,
                country: true,
              },
              time: {
                from: true,
                to: true,
              },
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

const touchedContributorTabFields = (contributors: Contributor[]): FormikTouched<unknown> => ({
  entityDescription: {
    contributors: contributors.map((_) => ({
      correspondingAuthor: true,
      sequence: true,
    })),
  },
});

const touchedFilesTabFields = (fileSet: FileSet | null): FormikTouched<unknown> => ({
  fileSet: fileSet
    ? {
        files: fileSet.files.map((file) => ({
          administrativeAgreement: true,
          publisherAuthority: !file.administrativeAgreement,
          embargoDate: !file.administrativeAgreement,
          license: !file.administrativeAgreement,
        })),
      }
    : true,
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
      touchedResourceTabFields(values.entityDescription?.reference?.publicationInstance.type ?? ''),
    [RegistrationTab.Contributors]: () => touchedContributorTabFields(values.entityDescription?.contributors ?? []),
    [RegistrationTab.FilesAndLicenses]: () => touchedFilesTabFields(values.fileSet),
  };

  // Set all fields on previous tabs to touched
  const fieldsToTouchOnMount = [];
  for (let thisTab = RegistrationTab.Description; thisTab <= tabToTouch; thisTab++) {
    fieldsToTouchOnMount.push(tabFields[thisTab]());
  }
  const mergedFields = mergeTouchedFields(fieldsToTouchOnMount);
  return mergedFields;
};
