import { FormikErrors, FormikTouched, getIn } from 'formik';
import {
  FileFieldNames,
  SpecificFileFieldNames,
  SpecificContributorFieldNames,
  ContributorFieldNames,
  PublicationType,
} from '../types/publicationFieldNames';
import { Contributor } from '../types/contributor.types';
import { File } from '../types/file.types';
import { Registration } from '../types/registration.types';
import deepmerge, { Options } from 'deepmerge';

interface CustomError {
  fieldName: string;
  errorMessage: string;
}

// Convert all errors from nested object to flat array
export const flattenFormikErrors = (validationErrors: FormikErrors<unknown>, fieldNamePrefix = ''): CustomError[] => {
  if (typeof validationErrors === 'object') {
    return Object.entries(validationErrors)
      .map(([fieldName, errorMessage]) => {
        const fieldPath = fieldNamePrefix ? `${fieldNamePrefix}-${fieldName}` : fieldName;
        if (typeof errorMessage === 'object' && errorMessage !== null) {
          if (Array.isArray(errorMessage)) {
            const errorArray = errorMessage as FormikErrors<unknown>[];
            const isStringErrors = errorArray.some((error) => typeof error === 'string');
            // Merge errors in array, and ignore their indexes
            const groupErrors = isStringErrors
              ? [...new Set(errorArray)].filter((error) => error)[0]
              : errorArray.reduce((result, current) => ({ ...result, ...current }), {});
            return flattenFormikErrors(groupErrors, fieldPath);
          } else {
            return flattenFormikErrors(errorMessage as FormikErrors<unknown>, fieldPath);
          }
        }
        return {
          fieldName: fieldPath,
          errorMessage: errorMessage as string,
        };
      })
      .flat();
  } else {
    return [
      {
        fieldName: fieldNamePrefix,
        errorMessage: validationErrors,
      },
    ];
  }
};

export const hasTouchedError = (
  errors: FormikErrors<unknown>,
  touched: FormikTouched<unknown>,
  fieldNames: string[]
): boolean => {
  if (!Object.keys(errors).length || !Object.keys(touched).length || !fieldNames.length) {
    return false;
  }

  return fieldNames.some((fieldName) => {
    const fieldHasError = !!getIn(errors, fieldName);
    const fieldIsTouched = !!getIn(touched, fieldName);
    // Touched data can be inconsistent with array of null or undefined elements when adding elements dynamically
    // to a FieldArray, so ensure it is a boolean value
    return fieldHasError && fieldIsTouched;
  });
};

export const getAllFileFields = (files: File[]): string[] => {
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

export const getAllContributorFields = (contributors: Contributor[]): string[] => {
  const fieldNames: string[] = [];
  if (contributors.length === 0) {
    fieldNames.push(ContributorFieldNames.CONTRIBUTORS);
  } else {
    contributors.forEach((contributor, index) => {
      const baseFieldName = `${ContributorFieldNames.CONTRIBUTORS}[${index}]`;
      fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.SEQUENCE}`);
      fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.CORRESPONDING}`);
      if (contributor.correspondingAuthor) {
        fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.EMAIL}`);
      }
    });
  }
  return fieldNames;
};

export const touchedDescriptionTabFields: FormikTouched<Registration> = {
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
    npiSubjectHeading: true,
    tags: true,
  },
};

export const touchedReferenceTabFields = (publicationType: PublicationType | ''): FormikTouched<unknown> => {
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

export const touchedContributorTabFields = (contributors: Contributor[]): FormikTouched<Registration> => ({
  entityDescription: {
    contributors: contributors.map((contributor) => ({
      affiliations: [],
      correspondingAuthor: true,
      sequence: true,
      email: contributor.correspondingAuthor,
    })),
  },
});

export const touchedFilesTabFields = (files: File[]): FormikTouched<Registration> => ({
  fileSet: {
    files: files.map((file) => ({
      administrativeAgreement: true,
      publisherAuthority: !file.administrativeAgreement,
      embargoDate: !file.administrativeAgreement,
      license: !file.administrativeAgreement,
    })),
  },
});

export const overwriteArrayMerge = (destinationArray: unknown[], sourceArray: unknown[], options?: Options) =>
  sourceArray;

export const mergeTouchedFields = (touchedArray: FormikTouched<Registration>[]) =>
  deepmerge.all(touchedArray, { arrayMerge: overwriteArrayMerge });
