import React, { FC, useState } from 'react';
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
import { InstitutionUser, RoleName } from '../../types/user.types';
import NormalText from '../../components/NormalText';
import { assignUserRole } from '../../api/roleApi';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';

const StyledTextField = styled(TextField)`
  width: 20rem;
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
  const dispatch = useDispatch();
  const [currentAdmins, setCurrentAdmins] = useState(admins);

  const addAdmin = async (adminValues: AdminValues) => {
    // Cast values according to validation schema to ensure doiUrl is trimmed
    const trimmedValues = adminValidationSchema.cast(adminValues);
    const userId = trimmedValues?.userId as string;

    const createdUserResponse = await assignUserRole(
      'b8c3e125-cadb-43d5-823a-2daa7768c3f9',
      userId,
      RoleName.INSTITUTION_ADMIN
    );

    if (createdUserResponse) {
      if (createdUserResponse.error) {
        dispatch(setNotification(createdUserResponse.error, NotificationVariant.Error));
      } else {
        if (currentAdmins.some((admin) => admin.username === createdUserResponse.username)) {
          dispatch(setNotification('feedback:info.user_already_has_role', NotificationVariant.Info));
        } else {
          dispatch(setNotification('feedback:success.added_role'));
          setCurrentAdmins((state) => [...state, createdUserResponse]);
        }
      }
    }
  };

  return (
    <Card>
      <Heading>{t('administrators')}</Heading>
      <Table>
        <TableBody>
          {currentAdmins.map((admin) => (
            <TableRow key={admin.username}>
              <TableCell>
                <NormalText>{admin.username}</NormalText>
              </TableCell>
              <TableCell>
                <Button color="secondary" variant="contained" disabled>
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
            {({ isSubmitting, isValid, dirty, values }) => (
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
                    disabled={!dirty || isSubmitting || !isValid}
                    onClick={() => addAdmin(values)} // TODO: <Form>?
                  >
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
