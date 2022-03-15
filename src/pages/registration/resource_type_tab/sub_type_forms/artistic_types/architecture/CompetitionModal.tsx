import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { Competition } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';

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
  const { t } = useTranslation('registration');

  return (
    <Dialog open={open} onClose={closeModal}>
      <DialogTitle>
        {competition ? t('resource_type.edit_exhibition_place') : t('resource_type.add_exhibition_place')}
      </DialogTitle>
      <Formik
        initialValues={competition ?? emptyCompetition}
        validationSchema={null}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        <Form noValidate>
          <DialogContent>
            <Field name={CompetitionFieldName.Name}>
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

            <Field name={CompetitionFieldName.Description}>
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

            <Field name={CompetitionFieldName.Date}>
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
