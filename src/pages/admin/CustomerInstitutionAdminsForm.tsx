import React, { FC, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableRow, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Formik, Field, FieldProps, Form, FormikHelpers } from 'formik';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';

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

const StyledTextField = styled(TextField)`
  width: 20rem;
`;

interface AdminValues {
  user: InstitutionUser | null;
}

const adminInitialValues: AdminValues = {
  user: null,
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
    const userId = adminValues.user?.username;
    if (!userId) {
      dispatch(setNotification(t('feedback:error.missing.user'), NotificationVariant.Info));
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
                <TableRow>
                  <Field name="user">
                    {({ field }: FieldProps) => (
                      <TableCell>
                        <Autocomplete
                          options={nonAdminUsers}
                          getOptionLabel={(option) => option.username}
                          value={field.value}
                          getOptionSelected={(option: InstitutionUser, value: InstitutionUser | null) =>
                            value?.username === option.username
                          }
                          loading={isLoadingUsers}
                          loadingText={t('loading_users')}
                          onChange={(_, value: InstitutionUser | null) => setFieldValue(field.name, value)}
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              label={t('users.new_institution_admin')}
                              variant="outlined"
                              helperText={t('search_for_user')}
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
