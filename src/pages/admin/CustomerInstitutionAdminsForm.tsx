import React, { FC } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Formik, Field, FieldProps, ErrorMessage } from 'formik';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import * as Yup from 'yup';

import Card from '../../components/Card';
import Heading from '../../components/Heading';
import { ErrorMessage as ErrorMessageString } from '../publication/PublicationFormValidationSchema';
import { InstitutionUser } from '../../types/user.types';
import NormalText from '../../components/NormalText';

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

const adminValidationSchema = Yup.object().shape({
  userId: Yup.string().trim().email(ErrorMessageString.INVALID_FORMAT),
});

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
      <Table>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.username}>
              <TableCell>
                <NormalText>{admin.username}</NormalText>
              </TableCell>
              <TableCell>
                <Button color="secondary" variant="contained" onClick={() => console.log('CLICK')}>
                  <DeleteIcon />
                  {t('common:remove')}
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {/* Add new admin */}
          <Formik
            onSubmit={addAdmin}
            initialValues={adminInitialValues}
            validationSchema={adminValidationSchema}
            validateOnChange={false}>
            {({ isSubmitting, isValid, dirty }) => (
              <TableRow>
                <Field name="userId">
                  {({ field, meta: { touched, error } }: FieldProps) => (
                    <TableCell>
                      <StyledTextField
                        {...field}
                        label={t('users.new_institution_admin')}
                        variant="outlined"
                        error={touched && !!error}
                        helperText={<ErrorMessage name={field.name} />}
                      />
                    </TableCell>
                  )}
                </Field>
                <TableCell>
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={!dirty || isSubmitting || !isValid}>
                    <AddIcon />
                    {t('common:add')}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </Formik>
        </TableBody>
      </Table>
    </Card>
  );
};

export default CustomerInstitutionAdminsForm;
