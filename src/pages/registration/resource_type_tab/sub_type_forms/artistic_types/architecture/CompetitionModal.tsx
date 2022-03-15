import { DatePicker, LocalizationProvider } from '@mui/lab';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { datePickerTranslationProps } from '../../../../../../themes/mainTheme';
import { Competition } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { getNewDateValue } from '../../../../../../utils/registration-helpers';
import { getDateFnsLocale } from '../../../../../../utils/date-helpers';

interface CopetitionModalProps {
  competition: Competition | null;
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

export const CompetitionModal = ({ competition, onSubmit, open, closeModal }: CopetitionModalProps) => {
  const { t, i18n } = useTranslation('registration');

  return (
    <Dialog open={open} onClose={closeModal} fullWidth>
      <DialogTitle>
        {competition ? t('resource_type.artistic.edit_competition') : t('resource_type.artistic.add_competition')}
      </DialogTitle>
      <Formik
        initialValues={competition ?? emptyCompetition}
        validationSchema={null}
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
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={getDateFnsLocale(i18n.language)}>
                  <DatePicker
                    {...datePickerTranslationProps}
                    label={t('resource_type.artistic.competition_date')}
                    value={field.value ?? null}
                    onChange={(date: any, keyboardInput) => {
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
                        data-testid={dataTestId.registrationWizard.resourceType.dateFromField}
                        variant="filled"
                        required
                        onBlur={() => !touched && setFieldTouched(field.name)}
                        error={touched && !!error}
                        helperText={<ErrorMessage name={field.name} />}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            </Field>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={closeModal}>
              {t('common:cancel')}
            </Button>
            <Button
              data-testid={dataTestId.registrationWizard.resourceType.saveVenueButton}
              variant="contained"
              type="submit">
              {competition ? t('common:save') : t('common:add')}
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
