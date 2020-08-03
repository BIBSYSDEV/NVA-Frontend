import React, { FC } from 'react';
import { TextField, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Formik, Field, FieldProps, ErrorMessage, Form } from 'formik';
import styled from 'styled-components';

import Card from '../../components/Card';
import Heading from '../../components/Heading';
import { adminValidationSchema } from '../publication/PublicationFormValidationSchema';
import { InstitutionUser } from '../../types/user.types';

const StyledNewAdminRow = styled(Form)`
  display: flex;
`;

const StyledTextField = styled(TextField)`
  width: 20rem;
  margin-right: 2rem;
`;

interface AdminValues {
  userId: string;
}

const adminInitialValues: AdminValues = {
  userId: '',
};

interface CustomerInstitutionAdminsFormProps {
  admins: InstitutionUser[];
}

const CustomerInstitutionAdminsForm: FC<CustomerInstitutionAdminsFormProps> = ({ admins }) => {
  const { t } = useTranslation('admin');

  const addAdmin = (adminValues: AdminValues) => {
    // Cast values according to validation schema to ensure doiUrl is trimmed
    const trimmedValues = adminValidationSchema.cast(adminValues);
    const userId = trimmedValues?.userId as string;
    console.log(userId);

    // TODO: Needs endpoint to add one role to one user for one institution
  };

  return (
    <Card>
      <Heading>{t('administrators')}</Heading>
      {admins.map((admin) => (
        <p>{admin.username}</p>
      ))}

      {/* Add new admin */}
      <Formik onSubmit={addAdmin} initialValues={adminInitialValues} validationSchema={adminValidationSchema}>
        {({ isSubmitting, isValid, dirty }) => (
          <StyledNewAdminRow>
            <Field name="userId">
              {({ field, meta: { touched, error } }: FieldProps) => (
                <StyledTextField
                  {...field}
                  label={t('users.new_institution_admin')}
                  variant="outlined"
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
            <Button color="primary" variant="contained" type="submit" disabled={!dirty || isSubmitting || !isValid}>
              {t('common:add')}
            </Button>
          </StyledNewAdminRow>
        )}
      </Formik>
    </Card>
  );
};

export default CustomerInstitutionAdminsForm;
