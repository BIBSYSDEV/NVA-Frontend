import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { CreateSerialPublicationPayload, createSerialPublication } from '../../../../api/publicationChannelApi';
import { setNotification } from '../../../../redux/notificationSlice';
import i18n from '../../../../translations/i18n';
import { SerialPublication } from '../../../../types/registration.types';

const issnRegex = /^\d{4}-\d{3}[\dXx]$/;

const journalValidationSchema: Yup.ObjectSchema<Omit<CreateSerialPublicationPayload, 'type'>> = Yup.object({
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
  onCreatedChannel: (createdChannel: SerialPublication) => void;
  isSeries?: boolean;
  initialName: string;
}

/**
 * Journals and Series are identical in terms of data, so this component is used for both.
 */
export const JournalFormDialog = ({
  open,
  closeDialog,
  onCreatedChannel,
  isSeries = false,
  initialName,
}: JournalFormDialogProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const journalMutation = useMutation({
    mutationFn: (journalData: CreateSerialPublicationPayload) => createSerialPublication(journalData),
    onError: () => dispatch(setNotification({ message: t('feedback.error.create_journal'), variant: 'error' })),
    onSuccess: (data) => {
      onCreatedChannel(data);
      dispatch(setNotification({ message: t('feedback.success.create_journal'), variant: 'success' }));
      closeDialog();
    },
  });

  const seriesMutation = useMutation({
    mutationFn: (seriesData: CreateSerialPublicationPayload) => createSerialPublication(seriesData),
    onError: () => dispatch(setNotification({ message: t('feedback.error.create_series'), variant: 'error' })),
    onSuccess: (data) => {
      onCreatedChannel(data);
      dispatch(setNotification({ message: t('feedback.success.create_series'), variant: 'success' }));
      closeDialog();
    },
  });

  const isLoading = journalMutation.isPending || seriesMutation.isPending;

  const initialValues = {
    type: isSeries ? 'Series' : 'Journal',
    name: initialName,
    homepage: '',
    printIssn: '',
    onlineIssn: '',
  } satisfies CreateSerialPublicationPayload;

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth>
      <DialogTitle>
        {isSeries ? t('registration.resource_type.create_series') : t('registration.resource_type.create_journal')}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={journalValidationSchema}
        onSubmit={async (values) =>
          isSeries ? await seriesMutation.mutateAsync(values) : await journalMutation.mutateAsync(values)
        }>
        <Form>
          <DialogContent>
            <Typography sx={{ mb: '1rem' }}>
              <Trans t={t} i18nKey="registration.resource_type.search_for_channel">
                <MuiLink href="https://portal.issn.org" target="_blank" rel="noopener noreferrer">
                  https://portal.issn.org
                </MuiLink>
              </Trans>
            </Typography>
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
                    disabled={isLoading}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    slotProps={{ htmlInput: { maxLength: 9 } }}
                  />
                )}
              </Field>
              <Field name="onlineIssn">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    label={t('registration.resource_type.online_issn')}
                    disabled={isLoading}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    slotProps={{ htmlInput: { maxLength: 9 } }}
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
