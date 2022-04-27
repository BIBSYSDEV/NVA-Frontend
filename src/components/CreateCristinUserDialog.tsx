import { LoadingButton } from '@mui/lab';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Field, FieldProps, Formik } from 'formik';
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
import { convertToCristinUser } from '../utils/user-helpers';

interface CreateCristinUserDialogProps {
  user: User;
}

export const CreateCristinUserDialog = ({ user }: CreateCristinUserDialogProps) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

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
    <Dialog open={true} fullWidth maxWidth="sm">
      <DialogTitle>{t('authorization:your_user_profile')}</DialogTitle>
      <Formik initialValues={{ ...emptyUser, nationalId: user.nationalIdNumber }} onSubmit={createUser}>
        {({ isSubmitting }) => (
          <>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="firstName">
                {({ field }: FieldProps<string>) => (
                  <TextField {...field} variant="filled" label={t('first_name')} required />
                )}
              </Field>
              <Field name="lastName">
                {({ field }: FieldProps<string>) => (
                  <TextField {...field} variant="filled" label={t('last_name')} required />
                )}
              </Field>
              <TextField
                variant="filled"
                disabled
                label={t('basicData:national_id')}
                required
                value={user.nationalIdNumber}
              />
            </DialogContent>
            <DialogActions>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {t('common:create')}
              </LoadingButton>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
};
