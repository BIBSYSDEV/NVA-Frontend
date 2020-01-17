import { Field, Formik, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Button } from '@material-ui/core';

const StyledInputBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
`;

const StyledTextField = styled(Field)`
  margin-right: 1rem;
`;

interface LinkPublicationFormProps {
  handleSearch: (values: any) => void;
}

const LinkPublicationForm: React.FC<LinkPublicationFormProps> = ({ handleSearch }) => {
  const { t } = useTranslation();

  const publicationSchema = Yup.object().shape({
    doiUrl: Yup.string()
      .url(t('publication:feedback.invalid_url'))
      .required(t('publication:feedback.required_field')),
  });

  return (
    <Formik
      onSubmit={(values, { setSubmitting }) => {
        handleSearch(values);
        setSubmitting(false);
      }}
      initialValues={{
        doiUrl: 'https://doi.org/10.1126/science.169.3946.635',
      }}
      validationSchema={publicationSchema}>
      <Form>
        <StyledInputBox>
          <StyledTextField
            aria-label="DOI-link"
            name="doiUrl"
            variant="outlined"
            fullWidth
            label={t('publication:publication.link')}
            component={TextField}
          />
          <Button color="primary" variant="contained" type="submit">
            {t('common:search')}
          </Button>
        </StyledInputBox>
      </Form>
    </Formik>
  );
};

export default LinkPublicationForm;
