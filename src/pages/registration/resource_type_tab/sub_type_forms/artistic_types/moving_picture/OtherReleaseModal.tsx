import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import { emptyInstant, emptyPlace } from '../../../../../../types/common.types';
import {
  OtherRelease,
  emptyUnconfirmedPublisher,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';

interface OtherReleaseModalProps {
  otherRelease?: OtherRelease;
  onSubmit: (otherRelease: OtherRelease) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyOtherRelease: OtherRelease = {
  type: 'OtherRelease',
  description: '',
  place: emptyPlace,
  publisher: emptyUnconfirmedPublisher,
  date: emptyInstant,
};

const validationSchema = Yup.object<YupShape<OtherRelease>>({
  description: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.artistic.other_release_description'),
    })
  ),
  place: Yup.object().shape({
    name: Yup.string().required(
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
                    data-testid={dataTestId.registrationWizard.resourceType.outputDescriptionField}
                  />
                )}
              </Field>
              <Field name="place.name">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    required
                    label={t('common.place')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.placeField}
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
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      if (!touched) {
                        setFieldTouched(field.name, true, false);
                      }
                      setFieldValue(field.name, date ?? '');
                    }}
                    slotProps={{
                      textField: {
                        inputProps: {
                          'data-testid': dataTestId.registrationWizard.resourceType.outputInstantDateField,
                        },
                        sx: { maxWidth: '13rem' },
                        variant: 'filled',
                        required: true,
                        error: touched && !!error,
                        helperText: <ErrorMessage name={field.name} />,
                      },
                    }}
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
