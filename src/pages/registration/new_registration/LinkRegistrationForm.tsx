import { Field, Formik, Form, FieldProps, FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ButtonWithProgress from '../../../components/ButtonWithProgress';
import { doiValidationSchema, isValidUrl } from '../../../utils/validation/doiSearchValidation';

const StyledForm = styled(Form)`
  display: flex;
  align-items: center;
`;

const StyledTextField = styled(TextField)`
  margin: 0 1rem 0 0;
`;

interface DoiFormValues {
  doiUrl: string;
}

const emptyDoiFormValues: DoiFormValues = {
  doiUrl: '',
};

const doiUrlBase = 'https://doi.org/';
const doiUrlPlaceholder = `${doiUrlBase}10.1000/xyz123`;
const doiRegExp = new RegExp('\\b(10[.][0-9]{4,}(?:[.][0-9]+)*/(?:(?!["&\'<>])\\S)+)\\b'); // https://stackoverflow.com/a/10324802

interface LinkRegistrationFormProps {
  handleSearch: (doiUrl: string) => Promise<void>;
}

const LinkRegistrationForm = ({ handleSearch }: LinkRegistrationFormProps) => {
  const { t } = useTranslation('registration');

  const onSubmit = async (values: DoiFormValues, { setValues }: FormikHelpers<DoiFormValues>) => {
    let doiUrl = values.doiUrl.trim().toLowerCase();
    if (!isValidUrl(doiUrl)) {
      const regexMatch = doiRegExp.exec(doiUrl);
      if (regexMatch && regexMatch.length > 0) {
        doiUrl = `${doiUrlBase}${regexMatch[0]}`;
      }
    }
    setValues({ doiUrl });
    await handleSearch(doiUrl);
  };

  return (
    <Formik onSubmit={onSubmit} initialValues={emptyDoiFormValues} validationSchema={doiValidationSchema}>
      {({ isSubmitting }) => (
        <StyledForm noValidate>
          <Field name="doiUrl">
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <StyledTextField
                id={field.name}
                data-testid="new-registration-link-field"
                variant="outlined"
                label={t('registration.link_to_resource')}
                required
                fullWidth
                disabled={isSubmitting}
                {...field}
                error={!!error && touched}
                InputLabelProps={{ shrink: true }}
                placeholder={doiUrlPlaceholder}
              />
            )}
          </Field>
          <ButtonWithProgress
            data-testid="doi-search-button"
            isLoading={isSubmitting}
            type="submit"
            endIcon={<SearchIcon />}>
            {t('common:search')}
          </ButtonWithProgress>
        </StyledForm>
      )}
    </Formik>
  );
};

export default LinkRegistrationForm;
