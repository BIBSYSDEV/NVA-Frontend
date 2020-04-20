import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { emptyNewContributor } from '../../../../types/contributor.types';
import { Collapse, Button } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import NormalText from '../../../../components/NormalText';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const StyledSmallButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledDescription = styled(NormalText)`
  white-space: pre-wrap;
`;

const CreateContributorModalContent = () => {
  const [readMore, setReadMore] = useState(false);
  const { t } = useTranslation('common');

  return (
    <Formik
      initialValues={emptyNewContributor}
      onSubmit={(values) => console.log('TODO NP-788 create new author here', values)}>
      <Form>
        <Collapse in={readMore} collapsedHeight="4.5rem">
          <StyledDescription>{t('description_create_authority')}</StyledDescription>
        </Collapse>
        <StyledSmallButtonContainer>
          {!readMore ? (
            <Button color="primary" onClick={() => setReadMore(true)}>
              {t('read_more')}
            </Button>
          ) : (
            <Button color="primary" onClick={() => setReadMore(false)}>
              {t('read_less')}
            </Button>
          )}
        </StyledSmallButtonContainer>
        <Field
          aria-label="firstName"
          name="firstName"
          label={t('first_name')}
          component={TextField}
          fullWidth
          variant="outlined"
          inputProps={{ 'data-testid': 'publication-title-input' }}
        />
        <Field
          aria-label="lastName"
          name="lastName"
          label={t('last_name')}
          component={TextField}
          fullWidth
          variant="outlined"
          inputProps={{ 'data-testid': 'publication-title-input' }}
        />
        <StyledButtonContainer>
          <Button type="submit" color="primary" variant="contained">
            {t('create_authority')}
          </Button>
        </StyledButtonContainer>
      </Form>
    </Formik>
  );
};

export default CreateContributorModalContent;
