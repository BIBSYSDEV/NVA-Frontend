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
import { CreatePublisherPayload, createPublisher } from '../../../../api/publicationChannelApi';
import { setNotification } from '../../../../redux/notificationSlice';
import i18n from '../../../../translations/i18n';
import { Publisher } from '../../../../types/registration.types';

const emptyPublisherData: CreatePublisherPayload = {
  name: '',
  homepage: '',
  isbnPrefix: '',
};

const isbnPrefixRegex = /^(?:97(8|9)-)?[0-9]{1,5}-[0-9]{1,7}$/;

const publisherValidationSchema: Yup.ObjectSchema<CreatePublisherPayload> = Yup.object({
  name: Yup.string().required(i18n.t('feedback.validation.is_required', { field: i18n.t('common.name') })),
  homepage: Yup.string()
    .url(i18n.t('feedback.validation.has_invalid_format', { field: i18n.t('common.link') }))
    .required(i18n.t('feedback.validation.is_required', { field: i18n.t('common.link') })),
  isbnPrefix: Yup.string()
    .optional()
    .matches(
      isbnPrefixRegex,
      i18n.t('feedback.validation.has_invalid_format', { field: i18n.t('registration.resource_type.isbn_prefix') })
    ),
});

interface PublisherFormDialogProps extends Pick<DialogProps, 'open'> {
  closeDialog: () => void;
  onCreatedChannel: (createdChannel: Publisher) => void;
  initialName: string;
}

export const PublisherFormDialog = ({ open, closeDialog, onCreatedChannel, initialName }: PublisherFormDialogProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const publisherMutation = useMutation({
    mutationFn: (publisherData: CreatePublisherPayload) => createPublisher(publisherData),
    onError: () => dispatch(setNotification({ message: t('feedback.error.create_publisher'), variant: 'error' })),
    onSuccess: (data) => {
      onCreatedChannel(data);
      dispatch(setNotification({ message: t('feedback.success.create_publisher'), variant: 'success' }));
      closeDialog();
    },
  });

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth>
      <DialogTitle>{t('registration.resource_type.create_publisher')}</DialogTitle>
      <Formik
        initialValues={{ ...emptyPublisherData, name: initialName }}
        validationSchema={publisherValidationSchema}
        onSubmit={async (values) => await publisherMutation.mutateAsync(values)}>
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
                    disabled={publisherMutation.isPending}
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
                    disabled={publisherMutation.isPending}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>

              <Field name="isbnPrefix">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    label={t('registration.resource_type.isbn_prefix')}
                    inputProps={{ maxLength: 13 }}
                    disabled={publisherMutation.isPending}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} disabled={publisherMutation.isPending}>
              {t('common.cancel')}
            </Button>
            <LoadingButton variant="contained" loading={publisherMutation.isPending} type="submit">
              {t('common.save')}
            </LoadingButton>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
