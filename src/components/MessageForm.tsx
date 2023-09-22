import SendIcon from '@mui/icons-material/Send';
import { CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';

interface MessageFormProps {
  confirmAction: (message: string) => Promise<unknown> | void;
  fieldLabel?: string;
  buttonTitle?: string;
}

interface MessageFormData {
  message: string;
}

const initValues: MessageFormData = {
  message: '',
};

const maxMessageLength = 160;

export const MessageForm = ({ confirmAction, fieldLabel, buttonTitle }: MessageFormProps) => {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={initValues}
      onSubmit={async (values, { resetForm }) => {
        await confirmAction(values.message.trim());
        resetForm();
      }}>
      {({ isSubmitting }) => (
        <Form>
          <Field name="message">
            {({ field }: FieldProps<string>) => (
              <TextField
                {...field}
                inputProps={{ maxLength: maxMessageLength }}
                disabled={isSubmitting}
                data-testid="message-field"
                variant="filled"
                multiline
                maxRows={Infinity}
                fullWidth
                required
                label={fieldLabel ?? t('common.message')}
                helperText={`${field.value.length}/${maxMessageLength}`}
                FormHelperTextProps={{ sx: { textAlign: 'end' } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isSubmitting ? (
                        <CircularProgress aria-label={buttonTitle ?? t('common.send')} size="1.5rem" />
                      ) : (
                        <IconButton
                          type="submit"
                          color="primary"
                          title={buttonTitle ?? t('common.send')}
                          data-testid="send-button">
                          <SendIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Field>
        </Form>
      )}
    </Formik>
  );
};
