import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import { Box, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../utils/dataTestIds';

interface MessageFormProps {
  confirmAction: (message: string) => Promise<unknown> | void;
  cancelAction?: () => void;
  fieldLabel?: string;
  buttonTitle?: string;
  hideRequiredAsterisk?: boolean;
}

interface MessageFormData {
  message: string;
}

const initValues: MessageFormData = {
  message: '',
};

const maxMessageLength = 160;

export const MessageForm = ({
  confirmAction,
  cancelAction,
  fieldLabel,
  buttonTitle,
  hideRequiredAsterisk,
}: MessageFormProps) => {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={initValues}
      onSubmit={async (values, { resetForm }) => {
        await confirmAction(values.message.trim());
        resetForm();
      }}>
      {({ isSubmitting }) => (
        <Box component={Form} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Field name="message">
            {({ field }: FieldProps<string>) => (
              <TextField
                {...field}
                data-testid={dataTestId.tasksPage.messageField}
                slotProps={{
                  htmlInput: { maxLength: maxMessageLength },
                  formHelperText: { sx: { textAlign: 'end' } },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {isSubmitting ? (
                          <CircularProgress aria-label={buttonTitle ?? t('common.send')} size="1.5rem" />
                        ) : (
                          <IconButton
                            type="submit"
                            color="primary"
                            data-testid={dataTestId.tasksPage.messageSendButton}
                            title={buttonTitle ?? t('common.send')}>
                            <SendIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
                sx={hideRequiredAsterisk ? { '& .MuiInputLabel-asterisk': { display: 'none' } } : undefined}
                disabled={isSubmitting}
                variant="filled"
                multiline
                minRows={3}
                maxRows={Infinity}
                fullWidth
                required
                label={fieldLabel ?? t('common.message')}
                helperText={`${field.value.length}/${maxMessageLength}`}
              />
            )}
          </Field>
          {cancelAction && (
            <IconButton
              color="primary"
              size="small"
              sx={{
                bgcolor: 'white',
                mt: '-2.25rem',
              }}
              onClick={cancelAction}
              title={t('common.cancel')}>
              <CancelIcon />
            </IconButton>
          )}
        </Box>
      )}
    </Formik>
  );
};
