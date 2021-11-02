import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  ThemeProvider,
  Box,
} from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { datePickerTranslationProps, lightTheme } from '../../../../../../themes/lightTheme';
import i18n from '../../../../../../translations/i18n';
import { Venue } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { getDateFnsLocale } from '../../../../../../utils/date-helpers';
import { getNewDateValue } from '../../../../../../utils/registration-helpers';

interface VenueModalProps {
  venue: Venue;
  onSubmit: (venue: Venue) => void;
  open: boolean;
  closeModal: () => void;
}

export const VenueModal = ({ venue, onSubmit, open, closeModal }: VenueModalProps) => {
  const { t } = useTranslation('registration');

  return (
    <ThemeProvider theme={lightTheme}>
      <Dialog open={open} onClose={closeModal}>
        <DialogTitle>{t('resource_type.add_venue')}</DialogTitle>
        <Formik
          initialValues={venue}
          onSubmit={(values) => {
            onSubmit(values);
            closeModal();
          }}>
          {({ setFieldValue, setFieldTouched }) => (
            <Form>
              <DialogContent>
                <Field name="name">
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      fullWidth
                      label={t('common:name')}
                      required
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={getDateFnsLocale(i18n.language)}>
                  <Box flex="row" sx={{ display: 'flex', 'div:first-child': { mr: '1rem' } }}>
                    <Field name={'time.from'}>
                      {({ field, meta: { error, touched } }: FieldProps<string>) => (
                        <DatePicker
                          {...datePickerTranslationProps}
                          label={t('resource_type.date_from')}
                          value={field.value ?? null}
                          onChange={(date, keyboardInput) => {
                            !touched && setFieldTouched(field.name, true, false);
                            const newValue = getNewDateValue(date, keyboardInput);
                            if (newValue !== null) {
                              setFieldValue(field.name, newValue);
                            }
                          }}
                          inputFormat="dd.MM.yyyy"
                          views={['year', 'month', 'day']}
                          maxDate={new Date(new Date().getFullYear() + 5, 11, 31)}
                          mask="__.__.____"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              data-testid={dataTestId.registrationWizard.resourceType.eventDateFrom}
                              variant="outlined"
                              required
                              onBlur={() => !touched && setFieldTouched(field.name)}
                              error={touched && !!error}
                              helperText={touched && error}
                            />
                          )}
                        />
                      )}
                    </Field>
                    <Field name={'time.to'}>
                      {({ field, meta: { error, touched } }: FieldProps<string>) => (
                        <DatePicker
                          {...datePickerTranslationProps}
                          label={t('resource_type.date_to')}
                          value={field.value ?? null}
                          onChange={(date, keyboardInput) => {
                            !touched && setFieldTouched(field.name, true, false);
                            const newValue = getNewDateValue(date, keyboardInput);
                            if (newValue !== null) {
                              setFieldValue(field.name, newValue);
                            }
                          }}
                          inputFormat="dd.MM.yyyy"
                          views={['year', 'month', 'day']}
                          maxDate={new Date(new Date().getFullYear() + 5, 11, 31)}
                          mask="__.__.____"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              data-testid={dataTestId.registrationWizard.resourceType.eventDateTo}
                              variant="outlined"
                              required
                              onBlur={() => !touched && setFieldTouched(field.name)}
                              error={touched && !!error}
                              helperText={touched && error}
                            />
                          )}
                        />
                      )}
                    </Field>
                  </Box>
                </LocalizationProvider>
              </DialogContent>
              <DialogActions>
                <Button variant="outlined" color="inherit" onClick={closeModal}>
                  {t('common:cancel')}
                </Button>
                <Button variant="contained" type="submit">
                  {t('common:save')}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </ThemeProvider>
  );
};
