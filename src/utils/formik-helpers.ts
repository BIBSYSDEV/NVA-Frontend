import { FormikErrors, FormikTouched, getIn } from 'formik';
import {
  FileFieldNames,
  SpecificFileFieldNames,
  SpecificContributorFieldNames,
  ContributorFieldNames,
} from '../types/publicationFieldNames';
import { Contributor } from '../types/contributor.types';
import { File } from '../types/file.types';
import { FormikPublication } from '../types/publication.types';
import deepmerge, { Options } from 'deepmerge';

interface CustomError {
  fieldName: string;
  errorMessage: string;
}

// Convert all errors from nested object to flat array
export const flattenFormikErrors = (
  validationErrors: FormikErrors<any>,
  fieldNamePrefix: string = ''
): CustomError[] => {
  return Object.entries(validationErrors)
    .map(([fieldName, errorMessage]) => {
      const fieldPath = fieldNamePrefix ? `${fieldNamePrefix}-${fieldName}` : fieldName;
      if (typeof errorMessage === 'object' && errorMessage !== null) {
        if (Array.isArray(errorMessage)) {
          // Merge errors in array, and ignore their indexes
          const groupErrors = (errorMessage as FormikErrors<any>[]).reduce(
            (result, current) => ({ ...result, ...current }),
            {}
          );
          return flattenFormikErrors(groupErrors, fieldPath);
        } else {
          return flattenFormikErrors(errorMessage as FormikErrors<any>, fieldPath);
        }
      }
      return {
        fieldName: fieldPath,
        errorMessage: errorMessage as string,
      };
    })
    .flat();
};

export const hasTouchedError = (
  errors: FormikErrors<any>,
  touched: FormikTouched<any>,
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

export const getAllFileFields = (files: File[]) => {
  let fieldNames: string[] = [];
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

export const getAllContributorFields = (contributors: Contributor[]) => {
  let fieldNames: string[] = [];
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

export const touchedDescriptionTabFields: FormikTouched<FormikPublication> = {
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

export const touchedReferenceTabFields: FormikTouched<FormikPublication> = {
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

export const touchedContributorTabFields = (contributors: Contributor[]): FormikTouched<FormikPublication> => ({
  entityDescription: {
    contributors: contributors.map((contributor) => ({
      affiliations: [],
      correspondingAuthor: true,
      sequence: true,
      email: contributor.correspondingAuthor,
    })),
  },
});

export const touchedFilesTabFields = (files: File[]): FormikTouched<FormikPublication> => ({
  fileSet: {
    files: files.map((file) => ({
      administrativeAgreement: true,
      publisherAuthority: !file.administrativeAgreement,
      embargoDate: !file.administrativeAgreement,
      license: !file.administrativeAgreement,
    })),
  },
});

const overwriteArrayMerge = (destinationArray: any[], sourceArray: any[], options?: Options) => sourceArray;
export const mergeTouchedFields = (touchedArray: FormikTouched<FormikPublication>[]) => {
  return deepmerge.all(touchedArray, { arrayMerge: overwriteArrayMerge });
};
