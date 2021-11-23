import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Button, DialogActions, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import i18n from '../translations/i18n';

interface MessageFormProps {
  confirmAction: (message: string) => Promise<unknown> | void;
  cancelAction?: () => void;
}

interface MessageFormData {
  message: string;
}

const initValues: MessageFormData = {
  message: '',
};

const validationSchema = Yup.object().shape({
  message: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('common:message'),
    })
  ),
});

export const MessageForm = ({ confirmAction, cancelAction }: MessageFormProps) => {
  const { t } = useTranslation('registration');

  return (
    <Formik
      initialValues={initValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        await confirmAction(values.message);
        resetForm();
      }}>
      {({ isSubmitting }) => (
        <Form noValidate>
          <Field name="message">
            {({ field, meta: { touched, error } }: FieldProps<string>) => (
              <TextField
                {...field}
                disabled={isSubmitting}
                data-testid="message-field"
                variant="outlined"
                multiline
                rows="4"
                fullWidth
                label={t('common:message')}
                required
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>

          <DialogActions>
            {cancelAction && (
              <Button data-testid="cancel-button" variant="outlined" onClick={cancelAction}>
                {t('common:cancel')}
              </Button>
            )}
            <LoadingButton
              data-testid="send-button"
              type="submit"
              variant="contained"
              endIcon={<MailOutlineIcon />}
              loadingPosition="end"
              loading={isSubmitting}>
              {t('common:send')}
            </LoadingButton>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};
