import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import { emptyInstant } from '../../../../../../types/common.types';
import { Competition } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';

interface CompetitionModalProps {
  competition?: Competition;
  onSubmit: (venue: Competition) => void;
  open: boolean;
  closeModal: () => void;
}

enum CompetitionFieldName {
  Name = 'name',
  Description = 'description',
  Date = 'date.value',
}

const emptyCompetition: Competition = {
  type: 'Competition',
  name: '',
  description: '',
  date: emptyInstant,
  sequence: 0,
};

const validationSchema = Yup.object<YupShape<Competition>>({
  name: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.artistic.competition_name'),
    })
  ),
  description: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.artistic.competition_rank'),
    })
  ),
  date: Yup.object().shape({
    value: Yup.date()
      .required(
        i18n.t('feedback.validation.is_required', {
          field: i18n.t('registration.resource_type.artistic.competition_date'),
        })
      )
      .typeError(
        i18n.t('feedback.validation.has_invalid_format', {
          field: i18n.t('registration.resource_type.artistic.competition_date'),
        })
      ),
  }),
});

export const CompetitionModal = ({ competition, onSubmit, open, closeModal }: CompetitionModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {competition
          ? t('registration.resource_type.artistic.edit_competition')
          : t('registration.resource_type.artistic.add_competition')}
      </DialogTitle>
      <Formik
        initialValues={competition ?? emptyCompetition}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ isSubmitting }: FormikProps<Competition>) => (
          <Form noValidate>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field name={CompetitionFieldName.Name}>
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.competition_name')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.competitionName}
                  />
                )}
              </Field>

              <Field name={CompetitionFieldName.Description}>
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.competition_rank')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.competitionDescription}
                  />
                )}
              </Field>

              <Field name={CompetitionFieldName.Date}>
                {({
                  field,
                  form: { setFieldTouched, setFieldValue },
                  meta: { error, touched },
                }: FieldProps<string>) => (
                  <DatePicker
                    label={t('registration.resource_type.artistic.competition_date')}
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      if (!touched) {
                        setFieldTouched(field.name, true, false);
                      }
                      setFieldValue(field.name, date ?? '');
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
                        error: touched && !!error,
                        helperText: <ErrorMessage name={field.name} />,
                      },
                    }}
                  />
                )}
              </Field>
            </DialogContent>
            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!competition} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
