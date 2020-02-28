import { Field, Formik, Form, FieldProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Button, TextField } from '@material-ui/core';

const StyledInputBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
`;

const StyledTextField = styled(TextField)`
  margin-right: 1rem;
`;

interface LinkPublicationFormProps {
  handleSearch: (values: any) => void;
}

const LinkPublicationForm: React.FC<LinkPublicationFormProps> = ({ handleSearch }) => {
  const { t } = useTranslation('publication');

  const publicationSchema = Yup.object().shape({
    doiUrl: Yup.string()
      .url(t('feedback.invalid_url'))
      .required(t('feedback.required_field')),
  });

  return (
    <Formik
      onSubmit={(values, { setSubmitting }) => {
        handleSearch(values);
        setSubmitting(false);
      }}
      initialValues={{
        doiUrl: '',
      }}
      validationSchema={publicationSchema}>
      <Form>
        <StyledInputBox>
          <Field name="doiUrl">
            {({ field }: FieldProps) => (
              <StyledTextField
                variant="outlined"
                label={t('publication.link')}
                fullWidth
                aria-label="DOI-link"
                inputProps={{ 'data-testid': 'new-publication-link-input' }}
                {...field}
              />
            )}
          </Field>
          <Button color="primary" variant="contained" type="submit" data-testid="doi-search-button">
            {t('common:search')}
          </Button>
        </StyledInputBox>
      </Form>
    </Formik>
  );
};

export default LinkPublicationForm;
