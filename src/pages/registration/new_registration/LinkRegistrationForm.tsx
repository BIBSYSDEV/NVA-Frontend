import { Field, Formik, Form, FieldProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField, Typography } from '@material-ui/core';
import ButtonWithProgress from '../../../components/ButtonWithProgress';
import { doiValidationSchema } from '../../../utils/validation/doiSearchValidation';

const StyledForm = styled(Form)`
  display: flex;
  align-items: center;
`;

const StyledTextField = styled(TextField)`
  margin: 0 1rem 0 0;
`;

export interface DoiFormValues {
  doiUrl: string;
}

const emptyDoiFormValues: DoiFormValues = {
  doiUrl: '',
};

interface LinkRegistrationFormProps {
  handleSearch: (values: { doiUrl: string }) => void;
}

const LinkRegistrationForm = ({ handleSearch }: LinkRegistrationFormProps) => {
  const { t } = useTranslation('registration');

  return (
    <Formik onSubmit={handleSearch} initialValues={emptyDoiFormValues} validationSchema={doiValidationSchema}>
      {({ isSubmitting }) => (
        <StyledForm noValidate>
          <Field name="doiUrl">
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <StyledTextField
                variant="outlined"
                label={t('registration.link_to_resource')}
                required
                fullWidth
                disabled={isSubmitting}
                aria-label="DOI-link"
                inputProps={{ 'data-testid': 'new-registration-link-input' }}
                {...field}
                error={!!error && touched}
              />
            )}
          </Field>
          <ButtonWithProgress data-testid="doi-search-button" isLoading={isSubmitting} type="submit">
            <Typography variant="button">{t('common:search')}</Typography>
          </ButtonWithProgress>
        </StyledForm>
      )}
    </Formik>
  );
};

export default LinkRegistrationForm;
