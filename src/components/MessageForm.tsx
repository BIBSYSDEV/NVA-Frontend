import React, { FC } from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Button, TextField, DialogActions } from '@material-ui/core';
import { Field, FieldProps, Form, Formik } from 'formik';
import ButtonWithProgress from './ButtonWithProgress';

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
  message: Yup.string().required(),
});

export const MessageForm: FC<MessageFormProps> = ({ confirmAction, cancelAction }) => {
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
        <Form>
          <Field name="message">
            {({ field, meta: { touched, error } }: FieldProps<string>) => (
              <TextField
                {...field}
                variant="outlined"
                multiline
                rows="4"
                fullWidth
                label={t('common:message')}
                error={touched && !!error}
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
              isLoading={isSubmitting}>
              {t('common:send')}
            </ButtonWithProgress>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};
