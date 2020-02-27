import React, { FC } from 'react';
import Card from '../../components/Card';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextField } from '@material-ui/core';
import { CustomerInstitutionFieldNames, emptyCustomerInstitution } from '../../types/customerInstitution.types';

const StyledFieldWrapper = styled.div`
  margin: 1rem;
  flex: 1 0 40%;
`;

const AdminCustomerInstitutionPage: FC = () => {
  const { t } = useTranslation('publication');

  return (
    <Card>
      <Formik
        initialValues={emptyCustomerInstitution}
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}>
        <Form>
          <StyledFieldWrapper>
            <Field
              aria-label="name"
              name={CustomerInstitutionFieldNames.NAME}
              label={t('common:name')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-instituiton-name-input' }}
            />
          </StyledFieldWrapper>
        </Form>
      </Formik>
    </Card>
  );
};

export default AdminCustomerInstitutionPage;
