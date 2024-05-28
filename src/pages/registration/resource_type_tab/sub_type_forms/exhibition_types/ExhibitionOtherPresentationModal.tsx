import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../translations/i18n';
import { emptyInstant, emptyPlace } from '../../../../../types/common.types';
import { emptyUnconfirmedPublisher } from '../../../../../types/publication_types/artisticRegistration.types';
import { ExhibitionOtherPresentation } from '../../../../../types/publication_types/exhibitionContent.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { OutputModalActions } from '../artistic_types/OutputModalActions';

interface ExhibitionOtherPresentationModalProps {
  exhibitionOtherPresentation?: ExhibitionOtherPresentation;
  onSubmit: (exhibitionOtherPresentation: ExhibitionOtherPresentation) => void;
  open: boolean;
  closeModal: () => void;
}

const validationSchema = Yup.object({
  typeDescription: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.exhibition_production.presentation_type'),
    })
  ),
  place: Yup.object().shape({
    label: Yup.string()
      .nullable()
      .required(
        i18n.t('feedback.validation.is_required', {
          field: i18n.t('common.place'),
        })
      ),
  }),
});

const emptyExhibitionOtherPresentation: ExhibitionOtherPresentation = {
  type: 'ExhibitionOtherPresentation',
  typeDescription: '',
  description: '',
  publisher: emptyUnconfirmedPublisher,
  place: emptyPlace,
  date: emptyInstant,
};

export const ExhibitionOtherPresentationModal = ({
  exhibitionOtherPresentation,
  onSubmit,
  open,
  closeModal,
}: ExhibitionOtherPresentationModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {exhibitionOtherPresentation
          ? t('registration.resource_type.exhibition_production.edit_exhibition_other_presentation')
          : t('registration.resource_type.exhibition_production.add_exhibition_other_presentation')}
      </DialogTitle>
      <Formik
        initialValues={exhibitionOtherPresentation ?? emptyExhibitionOtherPresentation}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const formattedValues: ExhibitionOtherPresentation = {
            ...values,
            date: values.date?.value
              ? {
                  type: 'Instant',
                  value: values.date.value,
                }
              : undefined,
          };
          onSubmit(formattedValues);
          closeModal();
        }}>
        {({ isSubmitting }: FormikProps<ExhibitionOtherPresentation>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="typeDescription">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    data-testid={dataTestId.registrationWizard.resourceType.outputTypeField}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.exhibition_production.presentation_type')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <Field name="place.label">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    data-testid={dataTestId.registrationWizard.resourceType.placeField}
                    variant="filled"
                    fullWidth
                    label={t('common.place')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <Field name="publisher.name">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    data-testid={dataTestId.registrationWizard.resourceType.publisherNameField}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.publisher_or_organizer')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <Field name="description">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    multiline
                    rows={2}
                    data-testid={dataTestId.registrationWizard.resourceType.outputDescriptionField}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.exhibition_production.more_info_about_elementet')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
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
                      !touched && setFieldTouched(field.name, true, false);
                      setFieldValue(field.name, date);
                    }}
                    slotProps={{
                      textField: {
                        inputProps: {
                          'data-testid': dataTestId.registrationWizard.resourceType.outputInstantDateField,
                        },
                        variant: 'filled',
                        sx: { maxWidth: '13rem' },
                        error: touched && !!error,
                        helperText: <ErrorMessage name={field.name} />,
                        required: true,
                      },
                    }}
                  />
                )}
              </Field>
            </DialogContent>
            <OutputModalActions
              isSubmitting={isSubmitting}
              closeModal={closeModal}
              isAddAction={!exhibitionOtherPresentation}
            />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
