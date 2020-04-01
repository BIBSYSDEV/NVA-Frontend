import { FormikErrors, FormikTouched, getIn } from 'formik';
import {
  FileFieldNames,
  SpecificFileFieldNames,
  SpecificContributorFieldNames,
  ContributorFieldNames,
} from '../types/publicationFieldNames';
import { Contributor } from '../types/contributor.types';
import { File } from '../types/file.types';

interface CustomError {
  fieldName: string;
  errorMessage: string;
}

// Convert all errors from nested object to flat array
export const flattenFormikErrors = (validationErrors: FormikErrors<any>): CustomError[] => {
  return Object.entries(validationErrors)
    .map(([fieldName, errorMessage]) => {
      if (typeof errorMessage === 'object' && errorMessage !== null) {
        return flattenFormikErrors(errorMessage as FormikErrors<any>);
      }
      return { fieldName, errorMessage };
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
    const fieldIsTouched = getIn(touched, fieldName);
    // Touched data can be inconsistent with array of null or undefined elements when adding elements dynamically
    // to a FieldArray, so check for value to be true explicitly, otherwise any array will also be true
    return fieldHasError && fieldIsTouched === true;
  });
};

export const getAllFileFields = (files: File[]) => {
  let fieldNames: string[] = [];
  if (files.length === 0) {
    fieldNames.push(FileFieldNames.FILE_SET);
  } else {
    files.forEach((file, index) => {
      const baseFieldName = `${FileFieldNames.FILE_SET}[${index}]`;
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
      if (contributor.corresponding) {
        fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.EMAIL}`);
      }
    });
  }
  return fieldNames;
};
