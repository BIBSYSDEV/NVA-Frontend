import { FormikErrors, FormikTouched, getIn } from 'formik';

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
