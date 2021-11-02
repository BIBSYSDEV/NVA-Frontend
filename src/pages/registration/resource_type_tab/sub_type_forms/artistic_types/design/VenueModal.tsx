import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../../../../themes/lightTheme';
import { Venue } from '../../../../../../types/publication_types/artisticRegistration.types';

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
                      variant="filled"
                      fullWidth
                      label={t('common:name')}
                      required
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
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
