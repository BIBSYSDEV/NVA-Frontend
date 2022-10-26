import { DatePicker } from '@mui/x-date-pickers';
import { Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Competition } from '../../../../../../types/publication_types/artisticRegistration.types';
import i18n from '../../../../../../translations/i18n';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { OutputModalActions } from '../OutputModalActions';
import { emptyInstant } from '../../../../../../types/common.types';

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
    i18n.t('translation:feedback.validation.is_required', {
      field: i18n.t('translation:registration.resource_type.artistic.competition_name'),
    })
  ),
  description: Yup.string().required(
    i18n.t('translation:feedback.validation.is_required', {
      field: i18n.t('translation:registration.resource_type.artistic.competition_rank'),
    })
  ),
  date: Yup.object().shape({
    value: Yup.date()
      .required(
        i18n.t('translation:feedback.validation.is_required', {
          field: i18n.t('translation:registration.resource_type.artistic.competition_date'),
        })
      )
      .typeError(
        i18n.t('translation:feedback.validation.has_invalid_format', {
          field: i18n.t('translation:registration.resource_type.artistic.competition_date'),
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
                    PopperProps={{
                      'aria-label': t('registration.resource_type.artistic.competition_date'),
                    }}
                    value={field.value ?? null}
                    onChange={(date) => {
                      !touched && setFieldTouched(field.name, true, false);
                      setFieldValue(field.name, date ?? '');
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
                        error={touched && !!error}
                        helperText={<ErrorMessage name={field.name} />}
                      />
                    )}
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
