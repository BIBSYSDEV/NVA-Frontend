import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Button, DialogActions, TextField } from '@material-ui/core';
import { ErrorMessage as ErrorMessageString } from '../utils/validation/errorMessage';
import ButtonWithProgress from './ButtonWithProgress';

interface MessageFormProps {
  confirmAction: (message: string) => Promise<unknown> | void;
  cancelAction?: () => void;
  disabled?: boolean;
}

interface MessageFormData {
  message: string;
}

const initValues: MessageFormData = {
  message: '',
};

const validationSchema = Yup.object().shape({
  message: Yup.string().required(ErrorMessageString.REQUIRED),
});

export const MessageForm = ({ confirmAction, cancelAction, disabled }: MessageFormProps) => {
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
                disabled={disabled}
                inputProps={{ 'data-testid': 'message-input' }}
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
            <ButtonWithProgress
              data-testid="send-button"
              disabled={disabled}
              type="submit"
              variant="contained"
              color="primary"
              isLoading={isSubmitting}>
              {t('common:send')}
            </ButtonWithProgress>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};
