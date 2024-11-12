import { Dialog, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import { emptyPlace } from '../../../../../../types/common.types';
import {
  LiteraryArtsPerformance,
  LiteraryArtsPerformanceSubtype,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { RegistrationDate, emptyRegistrationDate } from '../../../../../../types/registration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';

interface LiteraryArtsPerformanceModalProps {
  performance?: LiteraryArtsPerformance;
  onSubmit: (performance: LiteraryArtsPerformance) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyLiteraryArtsPerformance: LiteraryArtsPerformance = {
  type: 'LiteraryArtsPerformance',
  subtype: {
    type: '',
    description: '',
  },
  place: emptyPlace,
  publicationDate: emptyRegistrationDate,
};

const validationSchema = Yup.object<YupShape<LiteraryArtsPerformance>>({
  subtype: Yup.object().shape({
    type: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('registration.resource_type.type_work'),
      })
    ),
    description: Yup.string().when('type', ([type], schema) =>
      type === 'Other'
        ? schema.required(
            i18n.t('feedback.validation.is_required', {
              field: i18n.t('common.description'),
            })
          )
        : schema.optional()
    ),
  }),
  place: Yup.object({
    label: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('common.place'),
      })
    ),
  }),
  publicationDate: Yup.object<YupShape<RegistrationDate>>({
    year: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('common.date'),
      })
    ),
  }),
});

export const LiteraryArtsPerformanceModal = ({
  performance,
  onSubmit,
  open,
  closeModal,
}: LiteraryArtsPerformanceModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {performance
          ? t('registration.resource_type.artistic.edit_performance')
          : t('registration.resource_type.artistic.add_performance')}
      </DialogTitle>
      <Formik
        initialValues={performance ?? emptyLiteraryArtsPerformance}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ isSubmitting, errors, touched, values }: FormikProps<LiteraryArtsPerformance>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="subtype.type">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    variant="filled"
                    select
                    required
                    label={t('registration.resource_type.artistic.output_type.LiteraryArtsPerformance')}
                    fullWidth
                    {...field}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.subtypeField}>
                    {Object.values(LiteraryArtsPerformanceSubtype).map((performanceType) => (
                      <MenuItem key={performanceType} value={performanceType}>
                        {t(`registration.resource_type.artistic.performance_types.${performanceType}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Field>
              {values.subtype.type === 'LiteraryArtsPerformanceOther' ? (
                <Field name="subtype.description">
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <TextField
                      variant="filled"
                      required
                      label={t('common.description')}
                      fullWidth
                      {...field}
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                      data-testid={dataTestId.registrationWizard.resourceType.artisticSubtypeDescription}
                    />
                  )}
                </Field>
              ) : null}

              <Field name="place.label">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('common.place')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.placeField}
                  />
                )}
              </Field>

              <Field name="publicationDate">
                {({ field, form: { setFieldTouched, setFieldValue } }: FieldProps<RegistrationDate>) => (
                  <DatePicker
                    label={t('common.date')}
                    value={field.value.year ? new Date(+field.value.year, +field.value.month, +field.value.day) : null}
                    onChange={(date) => {
                      !touched && setFieldTouched(field.name, true, false);
                      if (date) {
                        setFieldValue('publicationDate', {
                          ...emptyRegistrationDate,
                          year: date.getFullYear(),
                          month: date.getMonth(),
                          day: date.getDate(),
                        });
                      } else {
                        setFieldValue('publicationDate', emptyRegistrationDate);
                      }
                    }}
                    views={['year', 'month', 'day']}
                    slotProps={{
                      textField: {
                        inputProps: {
                          'data-testid': dataTestId.registrationWizard.resourceType.outputInstantDateField,
                        },
                        onBlur: () => !touched && setFieldTouched(field.name),
                        variant: 'filled',
                        required: true,
                        error: touched.publicationDate && !!errors.publicationDate?.year,
                        helperText: touched.publicationDate && errors.publicationDate?.year,
                      },
                    }}
                  />
                )}
              </Field>
            </DialogContent>
            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!performance} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
