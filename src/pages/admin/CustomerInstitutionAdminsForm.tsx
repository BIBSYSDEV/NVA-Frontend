import React, { FC, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableRow, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Formik, Field, FieldProps, ErrorMessage, Form, FormikHelpers } from 'formik';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';

import Card from '../../components/Card';
import Heading from '../../components/Heading';
import { ErrorMessage as ErrorMessageString } from '../publication/PublicationFormValidationSchema';
import { InstitutionUser, RoleName } from '../../types/user.types';
import NormalText from '../../components/NormalText';
import { assignUserRole } from '../../api/roleApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import useFetchUsersForInstitution from '../../utils/hooks/useFetchUsersForInstitution';

const StyledTextField = styled(Autocomplete)`
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
  customerInstitutionId: string;
}

const CustomerInstitutionAdminsForm: FC<CustomerInstitutionAdminsFormProps> = ({ admins, customerInstitutionId }) => {
  const { t } = useTranslation('admin');
  const dispatch = useDispatch();
  const [users, isLoadingUsers] = useFetchUsersForInstitution(customerInstitutionId);
  const [currentAdmins, setCurrentAdmins] = useState(admins);
  const nonAdminUsers = users.filter((user) => !currentAdmins.some((admin) => admin.username === user.username));

  const addAdmin = async (adminValues: AdminValues, { resetForm }: FormikHelpers<AdminValues>) => {
    // Cast values according to validation schema to ensure userId is trimmed
    const trimmedValues = adminValidationSchema.cast(adminValues);
    const userId = trimmedValues?.userId as string;
    if (currentAdmins.some((admin) => admin.username === userId)) {
      dispatch(setNotification(t('feedback:info.user_already_has_role'), NotificationVariant.Info));
      return;
    }

    const createdUserResponse = await assignUserRole(customerInstitutionId, userId, RoleName.INSTITUTION_ADMIN);
    if (createdUserResponse) {
      if (createdUserResponse.error) {
        dispatch(setNotification(createdUserResponse.error, NotificationVariant.Error));
      } else {
        dispatch(setNotification(t('feedback:success.added_role')));
        setCurrentAdmins((state) => [...state, createdUserResponse]);
        resetForm();
      }
    }
  };

  return (
    <Card>
      <Heading>{t('administrators')}</Heading>
      <Formik
        onSubmit={addAdmin}
        initialValues={adminInitialValues}
        validationSchema={adminValidationSchema}
        validateOnChange={false}>
        {({ isSubmitting, isValid, dirty, setFieldValue, values }) => (
          <Form>
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
                {console.log(values)}
                <TableRow>
                  <Field name="userId">
                    {({ field, meta: { touched, error } }: FieldProps) => (
                      <TableCell>
                        <StyledTextField
                          options={nonAdminUsers}
                          getOptionLabel={(option: any) => {
                            return option.username ?? '';
                          }}
                          value={field.value}
                          getOptionSelected={(option: any, value: any) => {
                            if (value === '' && option === nonAdminUsers[0]) {
                              return true;
                            }
                            return value.username === option.username;
                          }}
                          loading={isLoadingUsers}
                          loadingText={'Laster brukere...'}
                          onChange={(_, value: any) => setFieldValue(field.name, value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t('users.new_institution_admin')}
                              variant="outlined"
                              error={touched && !!error}
                              helperText={'Søk blant eksiterende brukere' /*<ErrorMessage name={field.name} />*/}
                            />
                          )}
                        />
                      </TableCell>
                    )}
                  </Field>
                  <TableCell>
                    <ButtonWithProgress
                      color="primary"
                      variant="contained"
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={!dirty || !isValid}>
                      <AddIcon />
                      {t('common:add')}
                    </ButtonWithProgress>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default CustomerInstitutionAdminsForm;
