import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CristinApiPath } from '../api/apiPaths';
import { authenticatedApiRequest } from '../api/apiRequest';
import { getCurrentUserAttributes } from '../api/userApi';
import { emptyUser } from '../pages/basic_data/institution_admin/AddEmployeePage';
import { setUser } from '../redux/actions/userActions';
import { setNotification } from '../redux/notificationSlice';
import { CreateCristinUser, CristinUser, FlatCristinUser, User } from '../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../utils/constants';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { convertToCristinUser } from '../utils/user-helpers';
import { userValidationSchema } from '../utils/validation/basic_data/addEmployeeValidation';

interface CreateCristinUserDialogProps {
  user: User;
}

export const CreateCristinUserDialog = ({ user }: CreateCristinUserDialogProps) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const { handleLogout } = useAuthentication();
  const [acceptTermsValue, setAcceptTermsValue] = useState(false);

  const createUser = async (values: FlatCristinUser) => {
    const cristinUser: CreateCristinUser = convertToCristinUser(values);
    const createPersonResponse = await authenticatedApiRequest<CristinUser>({
      url: CristinApiPath.Person,
      method: 'POST',
      data: cristinUser,
    });
    if (isErrorStatus(createPersonResponse.status)) {
      dispatch(setNotification({ message: t('feedback:error.create_user'), variant: 'error' }));
    } else if (isSuccessStatus(createPersonResponse.status)) {
      dispatch(setNotification({ message: t('feedback:success.create_user'), variant: 'success' }));
      const newUserInfo = await getCurrentUserAttributes();
      dispatch(setUser(newUserInfo));
    }
  };

  return (
    <Dialog open={true} fullWidth maxWidth="xs">
      <DialogTitle>{t('authorization:your_user_profile')}</DialogTitle>
      <Formik
        initialValues={{ ...emptyUser, nationalId: user.nationalIdNumber }}
        validationSchema={userValidationSchema}
        onSubmit={createUser}>
        {({ isSubmitting }) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Typography>{t('authorization:create_user_info')}</Typography>
              <Field name="firstName">
                {({ field, meta: { error, touched } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    label={t('first_name')}
                    required
                    error={!!error && touched}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <Field name="lastName">
                {({ field, meta: { error, touched } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    label={t('last_name')}
                    required
                    error={!!error && touched}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <TextField
                variant="filled"
                disabled
                label={t('basicData:national_id')}
                required
                value={user.nationalIdNumber}
              />
              <FormControlLabel
                label={t('authorization:accept_terms_to_create_user')}
                control={
                  <Checkbox
                    required
                    checked={acceptTermsValue}
                    onChange={() => setAcceptTermsValue(!acceptTermsValue)}
                  />
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleLogout()}>{t('common:cancel')}</Button>
              <LoadingButton type="submit" variant="contained" disabled={!acceptTermsValue} loading={isSubmitting}>
                {t('common:create')}
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
