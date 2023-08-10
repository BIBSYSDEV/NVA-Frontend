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
import { Journal, Series } from '../../../../types/registration.types';

const emptyJournalData: CreateJournalPayload = {
  name: '',
  homepage: '',
  printIssn: '',
  onlineIssn: '',
};

const issnRegex = /^\d{4}-\d{3}[\dXx]$/;

const journalValidationSchema: Yup.ObjectSchema<CreateJournalPayload> = Yup.object({
  name: Yup.string().required(i18n.t('feedback.validation.is_required', { field: i18n.t('common.name') })),
  homepage: Yup.string()
    .url(i18n.t('feedback.validation.has_invalid_format', { field: i18n.t('common.link') }))
    .required(i18n.t('feedback.validation.is_required', { field: i18n.t('common.link') })),
  printIssn: Yup.string()
    .optional()
    .matches(
      issnRegex,
      i18n.t('feedback.validation.has_invalid_format', { field: i18n.t('registration.resource_type.print_issn') })
    ),
  onlineIssn: Yup.string()
    .optional()
    .matches(
      issnRegex,
      i18n.t('feedback.validation.has_invalid_format', { field: i18n.t('registration.resource_type.online_issn') })
    ),
});

interface JournalFormDialogProps extends Pick<DialogProps, 'open'> {
  closeDialog: () => void;
  onCreatedChannel: (createdChannel: Journal | Series) => void;
  isSeries?: boolean;
}

/**
 * Journals and Series are identical in terms of data, so this component is used for both.
 */
export const JournalFormDialog = ({
  open,
  closeDialog,
  onCreatedChannel,
  isSeries = false,
}: JournalFormDialogProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const journalMutation = useMutation({
    mutationFn: (journalData: CreateJournalPayload) => createJournal(journalData),
    onError: () => dispatch(setNotification({ message: t('feedback.error.create_journal'), variant: 'error' })),
    onSuccess: (data) => {
      onCreatedChannel(data);
      dispatch(setNotification({ message: t('feedback.success.create_journal'), variant: 'success' }));
      closeDialog();
    },
  });

  const seriesMutation = useMutation({
    mutationFn: (seriesData: CreateJournalPayload) => createSeries(seriesData),
    onError: () => dispatch(setNotification({ message: t('feedback.error.create_series'), variant: 'error' })),
    onSuccess: (data) => {
      onCreatedChannel(data);
      dispatch(setNotification({ message: t('feedback.success.create_series'), variant: 'success' }));
      closeDialog();
    },
  });

  const isLoading = journalMutation.isLoading || seriesMutation.isLoading;

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth>
      <DialogTitle>
        {isSeries ? t('registration.resource_type.create_series') : t('registration.resource_type.create_journal')}
      </DialogTitle>
      <Formik
        initialValues={emptyJournalData}
        validationSchema={journalValidationSchema}
        onSubmit={async (values) =>
          isSeries ? await seriesMutation.mutateAsync(values) : await journalMutation.mutateAsync(values)
        }>
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    inputProps={{ maxLength: 9 }}
                    disabled={isLoading}
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
                    inputProps={{ maxLength: 9 }}
                    disabled={isLoading}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} disabled={isLoading}>
              {t('common.cancel')}
            </Button>
            <LoadingButton variant="contained" loading={isLoading} type="submit">
              {t('common.save')}
            </LoadingButton>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
