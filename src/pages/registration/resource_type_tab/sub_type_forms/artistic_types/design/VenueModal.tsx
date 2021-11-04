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
import { venueValidationSchema } from '../../../../../../utils/validation/registration/referenceValidation';
import { PeriodFields } from '../../../components/PeriodFields';

interface VenueModalProps {
  venue: Venue | null;
  onSubmit: (venue: Venue) => void;
  open: boolean;
  closeModal: () => void;
}

enum VenueFieldName {
  Name = 'name',
  From = 'time.from',
  To = 'time.to',
}

const emptyVenue: Venue = {
  name: '',
  place: { type: 'UnconfirmedPlace', label: '', country: '' },
  time: { type: 'Period', from: '', to: '' },
};

export const VenueModal = ({ venue, onSubmit, open, closeModal }: VenueModalProps) => {
  const { t } = useTranslation('registration');

  return (
    <ThemeProvider theme={lightTheme}>
      <Dialog open={open} onClose={closeModal}>
        <DialogTitle>
          {venue ? t('resource_type.edit_exhibition_place') : t('resource_type.add_exhibition_place')}
        </DialogTitle>
        <Formik
          initialValues={venue ?? emptyVenue}
          validationSchema={venueValidationSchema}
          onSubmit={(values) => {
            onSubmit(values);
            closeModal();
          }}>
          {() => (
            <Form noValidate>
              <DialogContent>
                <Field name={VenueFieldName.Name}>
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <TextField
                      {...field}
                      data-testid={dataTestId.registrationWizard.resourceType.venueNameField}
                      variant="outlined"
                      fullWidth
                      label={t('resource_type.exhibition_place')}
                      required
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
                <Box sx={{ display: 'flex', gap: '3rem' }}>
                  <PeriodFields fromFieldName={VenueFieldName.From} toFieldName={VenueFieldName.To} />
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
                  {venue ? t('common:save') : t('common:add')}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </ThemeProvider>
  );
};
