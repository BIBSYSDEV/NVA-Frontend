import { LoadingButton } from '@mui/lab';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { createCristinPerson } from '../api/cristinApi';
import { setNotification } from '../redux/notificationSlice';
import { setPartialUser } from '../redux/userSlice';
import { CreateCristinPerson, FlatCristinPerson, User, emptyPerson } from '../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../utils/constants';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { convertToFlatCristinPerson } from '../utils/user-helpers';
import { userValidationSchema } from '../utils/validation/basic_data/addEmployeeValidation';
import { ConfirmDialog } from './ConfirmDialog';

interface CreateCristinPersonDialogProps {
  user: User;
}

export const CreateCristinPersonDialog = ({ user }: CreateCristinPersonDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { handleLogout } = useAuthentication();
  const [acceptedTermsValue, setAcceptedTermsValue] = useState(false);
  const [showConfirmCancelDialog, setShowConfirmCancelDialog] = useState(false);

  const createPerson = async (values: FlatCristinPerson) => {
    const cristinPerson: CreateCristinPerson = {
      identifiers: [{ type: 'NationalIdentificationNumber', value: values.nationalId }],
      names: [
        { type: 'FirstName', value: values.firstName },
        { type: 'LastName', value: values.lastName },
      ],
    };
    const createPersonResponse = await createCristinPerson(cristinPerson);
    if (isErrorStatus(createPersonResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_user'), variant: 'error' }));
    } else if (isSuccessStatus(createPersonResponse.status)) {
      dispatch(setNotification({ message: t('feedback.success.create_user'), variant: 'success' }));
      const flatCristinPerson = convertToFlatCristinPerson(createPersonResponse.data);
      dispatch(
        setPartialUser({
          cristinId: flatCristinPerson.id,
          givenName: flatCristinPerson.firstName,
          familyName: flatCristinPerson.lastName,
        })
      );
    }
  };

  return (
    <Dialog open={!!user} fullWidth maxWidth="xs">
      <DialogTitle>{t('authorization.your_user_profile')}</DialogTitle>
      <Formik
        initialValues={{
          ...emptyPerson,
          nationalId: user.nationalIdNumber,
          firstName: user.givenName,
          lastName: user.familyName,
        }}
        validationSchema={userValidationSchema}
        onSubmit={createPerson}>
        {({ isSubmitting }: FormikProps<FlatCristinPerson>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Typography>{t('authorization.create_user_info')}</Typography>
              <Field name="firstName">
                {({ field, meta: { error, touched } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    label={t('common.first_name')}
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
                    label={t('common.last_name')}
                    required
                    error={!!error && touched}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <TextField
                variant="filled"
                disabled
                label={t('common.national_id_number')}
                required
                value={user.nationalIdNumber}
              />
              <FormControlLabel
                label={t('authorization.accept_terms_to_create_user')}
                control={
                  <Checkbox
                    required
                    checked={acceptedTermsValue}
                    onChange={() => setAcceptedTermsValue(!acceptedTermsValue)}
                  />
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowConfirmCancelDialog(true)}>{t('common.cancel')}</Button>
              <LoadingButton type="submit" variant="contained" disabled={!acceptedTermsValue} loading={isSubmitting}>
                {t('common.create')}
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
      <ConfirmDialog
        open={showConfirmCancelDialog}
        title={t('authorization.cancel_create_user_title')}
        onAccept={() => handleLogout()}
        onCancel={() => setShowConfirmCancelDialog(false)}>
        <Typography>{t('authorization.cancel_create_user_text')}</Typography>
      </ConfirmDialog>
    </Dialog>
  );
};
