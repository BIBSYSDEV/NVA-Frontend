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
import { lightTheme } from '../../../../../../themes/lightTheme';
import { Venue } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { PeriodFields } from '../../../components/PeriodFields';

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
          {() => (
            <Form>
              <DialogContent>
                <Field name="name">
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <TextField
                      {...field}
                      data-testid={dataTestId.registrationWizard.resourceType.venueNameField}
                      variant="filled"
                      fullWidth
                      label={t('common:name')}
                      required
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
                <Box flex="row" sx={{ display: 'flex', 'div:first-of-type': { mr: '1rem' } }}>
                  <PeriodFields fromFieldName="time.from" toFieldName="time.to" />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button variant="outlined" color="inherit" onClick={closeModal}>
                  {t('common:cancel')}
                </Button>
                <Button
                  data-testid={dataTestId.registrationWizard.resourceType.saveVenueButton}
                  variant="contained"
                  type="submit">
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
