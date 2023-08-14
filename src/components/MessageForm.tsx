import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { LoadingButton } from '@mui/lab';
import { Box, Button, DialogActions, TextField, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';

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

export const MessageForm = ({ confirmAction, cancelAction }: MessageFormProps) => {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={initValues}
      onSubmit={async (values, { resetForm }) => {
        await confirmAction(values.message);
        resetForm();
      }}>
      {({ values, isSubmitting }) => (
        <Form noValidate>
          <Field name="message">
            {({ field, meta: { touched, error } }: FieldProps<string>) => (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                  {...field}
                  inputProps={{ maxLength: 160 }}
                  disabled={isSubmitting}
                  data-testid="message-field"
                  variant="filled"
                  multiline
                  maxRows={Infinity}
                  fullWidth
                  label={t('common.message')}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
                <Typography sx={{ alignSelf: 'end', color: 'gray' }}>{field.value.length}/160</Typography>
              </Box>
            )}
          </Field>

          <DialogActions>
            {cancelAction && (
              <Button data-testid="cancel-button" variant="outlined" onClick={cancelAction}>
                {t('common.cancel')}
              </Button>
            )}
            <LoadingButton
              data-testid="send-button"
              type="submit"
              variant="contained"
              endIcon={<MailOutlineIcon />}
              loadingPosition="end"
              disabled={!values.message}
              loading={isSubmitting}>
              {t('common.send')}
            </LoadingButton>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};
