import React, { FC, useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Formik, Field, FieldProps, ErrorMessage, Form, FormikHelpers } from 'formik';
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
import ButtonWithProgress from '../../components/ButtonWithProgress';

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
  customerInstitutionId: string;
}

const CustomerInstitutionAdminsForm: FC<CustomerInstitutionAdminsFormProps> = ({ admins, customerInstitutionId }) => {
  const { t } = useTranslation('admin');
  const dispatch = useDispatch();
  const [currentAdmins, setCurrentAdmins] = useState(admins);

  const addAdmin = async (adminValues: AdminValues, { resetForm }: FormikHelpers<AdminValues>) => {
    // Cast values according to validation schema to ensure doiUrl is trimmed
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
        {({ isSubmitting, isValid, dirty }) => (
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
