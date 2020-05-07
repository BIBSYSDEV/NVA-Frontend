import { Field, Formik, Form, FieldProps } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import * as Yup from 'yup';
import { TextField } from '@material-ui/core';
import ButtonWithProgress from '../../../components/ButtonWithProgress';

const StyledInputBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
`;

const StyledTextField = styled(TextField)`
  margin-right: 1rem;
`;

interface LinkPublicationFormProps {
  handleSearch: (values: { doiUrl: string }) => void;
}

const LinkPublicationForm: FC<LinkPublicationFormProps> = ({ handleSearch }) => {
  const { t } = useTranslation('publication');

  const publicationSchema = Yup.object().shape({
    doiUrl: Yup.string().url(t('feedback.invalid_url')).required(t('feedback.required_field')),
  });

  return (
    <Formik
      onSubmit={handleSearch}
      initialValues={{
        doiUrl: '',
      }}
      validationSchema={publicationSchema}>
      {({ isSubmitting }) => (
        <Form>
          <StyledInputBox>
            <Field name="doiUrl">
              {({ field }: FieldProps) => (
                <StyledTextField
                  variant="outlined"
                  label={t('publication.link_to_publication')}
                  fullWidth
                  aria-label="DOI-link"
                  inputProps={{ 'data-testid': 'new-publication-link-input' }}
                  {...field}
                />
              )}
            </Field>
            <ButtonWithProgress data-testid="doi-search-button" isLoading={isSubmitting} type="submit">
              {t('common:search')}
            </ButtonWithProgress>
          </StyledInputBox>
        </Form>
      )}
    </Formik>
  );
};

export default LinkPublicationForm;
