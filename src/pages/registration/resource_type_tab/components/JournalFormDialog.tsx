import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { CreateJournalPayload, createJournal, createSeries } from '../../../../api/publicationChannelApi';
import { setNotification } from '../../../../redux/notificationSlice';
import i18n from '../../../../translations/i18n';

const emptyJournalData: CreateJournalPayload = {
  name: '',
  homepage: '',
  printIssn: '',
  onlineIssn: '',
};

const journalValidationSchema: Yup.ObjectSchema<CreateJournalPayload> = Yup.object({
  name: Yup.string().required(i18n.t('feedback.validation.is_required', { field: i18n.t('common.name') })),
  homepage: Yup.string()
    .url(i18n.t('feedback.validation.has_invalid_format', { field: i18n.t('common.link') }))
    .required(i18n.t('feedback.validation.is_required', { field: i18n.t('common.link') })),
  printIssn: Yup.string().optional(),
  onlineIssn: Yup.string().optional(),
});

interface JournalFormDialogProps extends Pick<DialogProps, 'open'> {
  closeDialog: () => void;
  isSeries?: boolean;
}

/**
 * Journals and Series are identical in terms of data, so this component is used for both.
 */
export const JournalFormDialog = ({ open, closeDialog, isSeries = false }: JournalFormDialogProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const journalMutation = useMutation({
    mutationFn: (journalData: CreateJournalPayload) =>
      isSeries ? createSeries(journalData) : createJournal(journalData),
    onError: () =>
      isSeries
        ? dispatch(setNotification({ message: t('feedback.error.create_series'), variant: 'error' }))
        : dispatch(setNotification({ message: t('feedback.error.create_journal'), variant: 'error' })),
    onSuccess: () => {
      // TODO: Add created Journal/Series to current registration (NP-45067)
      if (isSeries) {
        dispatch(setNotification({ message: t('feedback.success.create_series'), variant: 'success' }));
      } else {
        dispatch(setNotification({ message: t('feedback.success.create_journal'), variant: 'success' }));
      }
      closeDialog();
    },
  });

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth>
      <DialogTitle>
        {isSeries ? t('registration.resource_type.create_series') : t('registration.resource_type.create_journal')}
      </DialogTitle>
      <Formik
        initialValues={emptyJournalData}
        validationSchema={journalValidationSchema}
        onSubmit={async (values) => await journalMutation.mutateAsync(values)}>
        <Form>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Field name="name">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    required
                    label={t('common.name')}
                    disabled={journalMutation.isLoading}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <Field name="homepage">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    required
                    label={t('common.link')}
                    disabled={journalMutation.isLoading}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>

              <Field name="printIssn">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    label={t('registration.resource_type.print_issn')}
                    disabled={journalMutation.isLoading}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <Field name="onlineIssn">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    label={t('registration.resource_type.online_issn')}
                    disabled={journalMutation.isLoading}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} disabled={journalMutation.isLoading}>
              {t('common.cancel')}
            </Button>
            <LoadingButton variant="contained" loading={journalMutation.isLoading} type="submit">
              {t('common.save')}
            </LoadingButton>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
