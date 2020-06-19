import { Field, Formik, Form, FieldProps, ErrorMessage } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import ButtonWithProgress from '../../../components/ButtonWithProgress';
import { doiValidationSchema } from '../PublicationFormValidationSchema';

const StyledInputBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
`;

const StyledTextField = styled(TextField)`
  margin-right: 1rem;
`;

export interface DoiFormValues {
  doiUrl: string;
}

const emptyDoiFormValues: DoiFormValues = {
  doiUrl: '',
};

interface LinkPublicationFormProps {
  handleSearch: (values: { doiUrl: string }) => void;
}

const LinkPublicationForm: FC<LinkPublicationFormProps> = ({ handleSearch }) => {
  const { t } = useTranslation('publication');

  return (
    <Formik onSubmit={handleSearch} initialValues={emptyDoiFormValues} validationSchema={doiValidationSchema}>
      {({ isSubmitting, isValid, dirty }) => (
        <Form>
          <StyledInputBox>
            <Field name="doiUrl">
              {({ field, meta: { error, touched } }: FieldProps) => (
                <StyledTextField
                  variant="outlined"
                  label={t('publication.link_to_publication')}
                  fullWidth
                  aria-label="DOI-link"
                  inputProps={{ 'data-testid': 'new-publication-link-input' }}
                  {...field}
                  error={!!error && touched}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
            <ButtonWithProgress
              data-testid="doi-search-button"
              isLoading={isSubmitting}
              disabled={!isValid || !dirty}
              type="submit">
              {t('common:search')}
            </ButtonWithProgress>
          </StyledInputBox>
        </Form>
      )}
    </Formik>
  );
};

export default LinkPublicationForm;
