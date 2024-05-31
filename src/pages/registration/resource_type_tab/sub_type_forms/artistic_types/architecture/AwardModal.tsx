import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import { emptyInstant } from '../../../../../../types/common.types';
import { Award } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';

interface AwardModalProps {
  award?: Award;
  onSubmit: (award: Award) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyAward: Award = {
  type: 'Award',
  name: '',
  organizer: '',
  date: emptyInstant,
  otherInformation: '',
  ranking: null,
  sequence: 0,
};

const validationSchema = Yup.object<YupShape<Award>>({
  name: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.artistic.award_name'),
    })
  ),
  organizer: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.artistic.award_organizer'),
    })
  ),
  date: Yup.object().shape({
    value: Yup.date().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('common.year'),
      })
    ),
  }),
});

export const AwardModal = ({ award, onSubmit, open, closeModal }: AwardModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {award
          ? t('registration.resource_type.artistic.edit_award')
          : t('registration.resource_type.artistic.add_award')}
      </DialogTitle>
      <Formik
        initialValues={award ?? emptyAward}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ isSubmitting }: FormikProps<Award>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name="name">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.award_name')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.awardName}
                  />
                )}
              </Field>

              <Field name="organizer">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.award_organizer')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.awardOrganizer}
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
                    label={t('common.year')}
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      !touched && setFieldTouched(field.name, true, false);
                      setFieldValue(field.name, date ?? '');
                    }}
                    views={['year']}
                    slotProps={{
                      textField: {
                        inputProps: {
                          'data-testid': dataTestId.registrationWizard.resourceType.outputInstantDateField,
                        },
                        onBlur: () => !touched && setFieldTouched(field.name),
                        variant: 'filled',
                        required: true,
                        error: touched && !!error,
                        helperText: <ErrorMessage name={field.name} />,
                      },
                    }}
                  />
                )}
              </Field>

              <Field name="ranking">
                {({ field, meta: { touched, error } }: FieldProps<number>) => (
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    variant="filled"
                    fullWidth
                    type="number"
                    label={t('registration.resource_type.artistic.award_ranking')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.awardRanking}
                  />
                )}
              </Field>

              <Field name="otherInformation">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.award_other_type')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.awardOther}
                  />
                )}
              </Field>
            </DialogContent>
            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!award} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
