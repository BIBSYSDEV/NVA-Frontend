import { FormikErrors, FormikTouched, getIn } from 'formik';
import {
  FileFieldNames,
  SpecificFileFieldNames,
  SpecificContributorFieldNames,
  ContributorFieldNames,
} from '../types/publicationFieldNames';

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
    return fieldHasError && fieldIsTouched;
  });
};

export const getAllFileFields = (numberOfUploadedFiles: number) => {
  let fieldNames: string[] = Object.values(FileFieldNames);
  if (numberOfUploadedFiles > 0) {
    for (let index = 0; index < numberOfUploadedFiles; index++) {
      for (const fileField of Object.values(SpecificFileFieldNames)) {
        fieldNames.push(`${FileFieldNames.FILE_SET}[${index}].${fileField}`);
      }
    }
  }
  return fieldNames;
};

export const getAllContributorFields = (numberOfContributors: number) => {
  let fieldNames: string[] = Object.values(ContributorFieldNames);
  if (numberOfContributors > 0) {
    for (let index = 0; index < numberOfContributors; index++) {
      for (const fileField of Object.values(SpecificContributorFieldNames)) {
        fieldNames.push(`${ContributorFieldNames.CONTRIBUTORS}[${index}].${fileField}`);
      }
    }
  }
  return fieldNames;
};
