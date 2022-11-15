import { Dialog, DialogTitle, DialogContent, TextField, Box } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import { emptyPeriod } from '../../../../../../types/common.types';
import { Venue } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { periodField } from '../../../../../../utils/validation/registration/referenceValidation';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { PeriodFields } from '../../../components/PeriodFields';
import { OutputModalActions } from '../OutputModalActions';

interface VenueModalProps {
  venue?: Venue;
  onSubmit: (venue: Venue) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyVenue: Venue = {
  type: 'Venue',
  place: { type: 'UnconfirmedPlace', label: '', country: '' },
  date: emptyPeriod,
};

const validationSchema = Yup.object<YupShape<Venue>>({
  place: Yup.object().shape({
    label: Yup.string()
      .nullable()
      .required(
        i18n.t('translation:feedback.validation.is_required', {
          field: i18n.t('translation:registration.resource_type.artistic.exhibition_place'),
        })
      ),
  }),
  date: periodField,
});

export const VenueModal = ({ venue, onSubmit, open, closeModal }: VenueModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal}>
      <DialogTitle>
        {venue
          ? t('registration.resource_type.artistic.edit_exhibition_place')
          : t('registration.resource_type.artistic.add_exhibition_place')}
      </DialogTitle>
      <Formik
        initialValues={venue ?? emptyVenue}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ isSubmitting }: FormikProps<Venue>) => (
          <Form noValidate>
            <DialogContent>
              <Field name="place.label">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    data-testid={dataTestId.registrationWizard.resourceType.venueNameField}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.artistic.exhibition_place')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <Box sx={{ display: 'flex', gap: '3rem', mt: '1rem' }}>
                <PeriodFields fromFieldName="date.from" toFieldName="date.to" />
              </Box>
            </DialogContent>
            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!venue} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
