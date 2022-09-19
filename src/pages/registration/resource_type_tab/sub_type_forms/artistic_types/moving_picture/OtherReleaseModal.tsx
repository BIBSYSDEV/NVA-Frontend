import { DatePicker } from '@mui/x-date-pickers';
import { Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { OtherRelease } from '../../../../../../types/publication_types/artisticRegistration.types';
import i18n from '../../../../../../translations/i18n';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';
import { dataTestId } from '../../../../../../utils/dataTestIds';

interface OtherReleaseModalProps {
  otherRelease?: OtherRelease;
  onSubmit: (otherRelease: OtherRelease) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyOtherRelease: OtherRelease = {
  type: 'OtherRelease',
  description: '',
  place: {
    type: 'UnconfirmedPlace',
    label: '',
    country: '',
  },
  publisher: {
    type: 'UnconfirmedPublisher',
    name: '',
  },
  date: {
    type: 'Instant',
    value: '',
  },
};

const validationSchema = Yup.object<YupShape<OtherRelease>>({
  description: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.artistic.other_release_description'),
    })
  ),
  place: Yup.object().shape({
    label: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('common.place'),
      })
    ),
  }),
  publisher: Yup.object().shape({
    name: Yup.string(),
  }),
  date: Yup.object().shape({
    value: Yup.date()
      .required(
        i18n.t('feedback.validation.is_required', {
          field: i18n.t('common.date'),
        })
      )
      .typeError(
        i18n.t('feedback.validation.has_invalid_format', {
          field: i18n.t('common.date'),
        })
      ),
  }),
});

export const OtherReleaseModal = ({ otherRelease, onSubmit, open, closeModal }: OtherReleaseModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="sm" fullWidth>
      <DialogTitle>
        {otherRelease
          ? t('registration.resource_type.artistic.edit_other_release')
          : t('registration.resource_type.artistic.add_other_release')}
      </DialogTitle>
      <Formik
        initialValues={otherRelease ?? emptyOtherRelease}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ isSubmitting }: FormikProps<OtherRelease>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="description">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.other_release_description')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.otherReleaseType}
                  />
                )}
              </Field>
              <Field name="place.label">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    required
                    label={t('common.place')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.otherReleasePlace}
                  />
                )}
              </Field>
              <Field name="publisher.name">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.other_announcement_organizer')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.otherReleasePublisher}
                  />
                )}
              </Field>
              <Field name="date.value">
                {({
                  field,
                  form: { setFieldTouched, setFieldValue },
                  meta: { error, touched },
                }: FieldProps<string>) => (
                  <DatePicker
                    label={t('common.date')}
                    PopperProps={{
                      'aria-label': t('common.date'),
                    }}
                    value={field.value ?? null}
                    onChange={(date) => {
                      !touched && setFieldTouched(field.name, true, false);
                      setFieldValue(field.name, date ?? '');
                    }}
                    inputFormat="dd.MM.yyyy"
                    mask="__.__.____"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        data-testid={dataTestId.registrationWizard.resourceType.otherReleaseDate}
                        sx={{ maxWidth: '13rem' }}
                        variant="filled"
                        required
                        error={touched && !!error}
                        helperText={<ErrorMessage name={field.name} />}
                      />
                    )}
                  />
                )}
              </Field>
            </DialogContent>

            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!otherRelease} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
