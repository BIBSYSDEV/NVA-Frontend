import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import styled from 'styled-components';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

const StyledInputBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
`;

const StyledTextField = styled(Field)`
  margin-right: 1rem;
`;

interface LinkPublicationPanelFormProps {
  handleSearch: (values: any) => void;
}

const LinkPublicationPanelForm: React.FC<LinkPublicationPanelFormProps> = ({ handleSearch }) => {
  const { t } = useTranslation();

  const resourceSchema = Yup.object().shape({
    doiUrl: Yup.string()
      .url(t('resource_form.feedback.invalid_url'))
      .required(t('resource_form.feedback.required_field')),
  });

  return (
    <Formik
      onSubmit={values => {
        handleSearch(values);
      }}
      initialValues={{
        doiUrl: '',
      }}
      validationSchema={resourceSchema}>
      {() => (
        <Form>
          <StyledInputBox>
            <StyledTextField
              aria-label="DOI-link"
              margin="dense"
              name="doiUrl"
              variant="outlined"
              fullWidth
              label={t('publication_panel.ORCID-link')}
              component={TextField}
            />
            <Button color="primary" variant="contained" type="submit">
              {t('publication_panel.search')}
            </Button>
          </StyledInputBox>
        </Form>
      )}
    </Formik>
  );
};

export default LinkPublicationPanelForm;
