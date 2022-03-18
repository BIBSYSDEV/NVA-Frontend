import { DatePicker } from '@mui/lab';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { datePickerTranslationProps } from '../../../../../../themes/mainTheme';
import { Competition } from '../../../../../../types/publication_types/artisticRegistration.types';
import { getNewDateValue } from '../../../../../../utils/registration-helpers';
import i18n from '../../../../../../translations/i18n';

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
  date: { type: 'Instant', value: '' },
  sequence: 0,
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('registration:resource_type.artistic.competition_name'),
    })
  ),
  description: Yup.string().required(
    i18n.t('feedback:validation.is_required', {
      field: i18n.t('registration:resource_type.artistic.competition_rank'),
    })
  ),
  date: Yup.object().shape({
    value: Yup.date().required(
      i18n.t('feedback:validation.is_required', {
        field: i18n.t('registration:resource_type.artistic.competition_date'),
      })
    ),
  }),
});

export const CompetitionModal = ({ competition, onSubmit, open, closeModal }: CompetitionModalProps) => {
  const { t } = useTranslation('registration');

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {competition ? t('resource_type.artistic.edit_competition') : t('resource_type.artistic.add_competition')}
      </DialogTitle>
      <Formik
        initialValues={competition ?? emptyCompetition}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        <Form noValidate>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field name={CompetitionFieldName.Name}>
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('resource_type.artistic.competition_name')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>

            <Field name={CompetitionFieldName.Description}>
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('resource_type.artistic.competition_rank')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>

            <Field name={CompetitionFieldName.Date}>
              {({ field, form: { setFieldTouched, setFieldValue }, meta: { error, touched } }: FieldProps<string>) => (
                <DatePicker
                  {...datePickerTranslationProps}
                  label={t('resource_type.artistic.competition_date')}
                  value={field.value ?? null}
                  onChange={(date: Date | null, keyboardInput) => {
                    !touched && setFieldTouched(field.name, true, false);
                    const newValue = getNewDateValue(date, keyboardInput);
                    if (newValue !== null) {
                      setFieldValue(field.name, newValue);
                    }
                  }}
                  inputFormat="dd.MM.yyyy"
                  views={['year', 'month', 'day']}
                  mask="__.__.____"
                  renderInput={(params) => (
                    <TextField
                      {...params}
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
          <DialogActions>
            <Button variant="outlined" onClick={closeModal}>
              {t('common:cancel')}
            </Button>
            <Button variant="contained" type="submit">
              {competition ? t('common:save') : t('common:add')}
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
