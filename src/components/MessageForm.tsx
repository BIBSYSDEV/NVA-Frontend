import React, { FC } from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Button, TextField, DialogActions } from '@material-ui/core';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import ButtonWithProgress from './ButtonWithProgress';

interface MessageFormProps {
  confirmAction: (message: string) => void;
  cancelAction?: () => void;
}

const initValues = {
  message: '',
};

const validationSchema = Yup.object().shape({
  message: Yup.string().required(),
});

export const MessageForm: FC<MessageFormProps> = ({ confirmAction, cancelAction }) => {
  const { t } = useTranslation('registration');

  const sendMessage = async (values: any) => {
    // eslint-disable-next-line no-console
    console.log('message1:', values.message);
    confirmAction(values.message);
  };

  return (
    <Formik initialValues={initValues} validationSchema={validationSchema} onSubmit={sendMessage}>
      <Form>
        <Field name="message">
          {({ field, meta: { touched, error } }: FieldProps) => (
            <TextField
              {...field}
              variant="outlined"
              multiline
              rows="4"
              fullWidth
              label={t('common:message')}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>

        <DialogActions>
          {cancelAction && (
            <Button variant="outlined" onClick={cancelAction}>
              {t('common:cancel')}
            </Button>
          )}
          <ButtonWithProgress
            type="submit"
            variant="contained"
            color="primary"
            data-testid="button-send-message"
            isLoading={false}>
            {t('common:send')}
          </ButtonWithProgress>
        </DialogActions>
      </Form>
    </Formik>
  );
};
