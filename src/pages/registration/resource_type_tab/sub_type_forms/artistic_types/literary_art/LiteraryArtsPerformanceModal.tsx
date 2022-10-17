import { Dialog, DialogTitle, DialogContent, TextField, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Formik, Form, Field, FieldProps, ErrorMessage, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import {
  LiteraryArtsPerformance,
  LiteraryArtsPerformanceSubtype,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { emptyRegistrationDate, RegistrationDate } from '../../../../../../types/registration.types';
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
  subtype: '',
  place: { type: 'UnconfirmedPlace', label: '', country: '' },
  publicationDate: emptyRegistrationDate,
};

const validationSchema = Yup.object<YupShape<LiteraryArtsPerformance>>({
  subtype: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.type_work'),
    })
  ),
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
        {({ isSubmitting, errors, touched }: FormikProps<LiteraryArtsPerformance>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="subtype">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    variant="filled"
                    select
                    required
                    label={t('registration.resource_type.type_work')}
                    fullWidth
                    {...field}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.artisticSubtype}>
                    {Object.values(LiteraryArtsPerformanceSubtype).map((performanceType) => (
                      <MenuItem key={performanceType} value={performanceType}>
                        {t(`registration.resource_type.artistic.performance_types.${performanceType}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Field>
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
                    PopperProps={{
                      'aria-label': t('common.date'),
                    }}
                    value={field.value.year ? new Date(+field.value.year, +field.value.month, +field.value.day) : null}
                    onChange={(date, keyboardInput) => {
                      !touched && setFieldTouched(field.name, true, false);
                      const isTriggeredByInvalidKeyboardInput = keyboardInput && keyboardInput.length !== 10;
                      if (date && !isTriggeredByInvalidKeyboardInput) {
                        setFieldValue('publicationDate', {
                          ...emptyRegistrationDate,
                          year: date.getFullYear(),
                          month: date.getMonth(),
                          day: date.getDate(),
                        });
                      } else if (!date) {
                        setFieldValue('publicationDate', emptyRegistrationDate);
                      }
                    }}
                    inputFormat="dd.MM.yyyy"
                    views={['year', 'month', 'day']}
                    mask="__.__.____"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        data-testid={dataTestId.registrationWizard.resourceType.artisticOutputDate}
                        variant="filled"
                        required
                        onBlur={() => !touched && setFieldTouched(field.name)}
                        error={touched.publicationDate && !!errors.publicationDate?.year}
                        helperText={touched.publicationDate && errors.publicationDate?.year}
                      />
                    )}
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
