import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { Exhibition } from '../../../../../../types/publication_types/artisticRegistration.types';
import { PeriodFields } from '../../../components/PeriodFields';

interface ExhibitionModalProps {
  exhibition?: Exhibition;
  onSubmit: (exhibition: Exhibition) => void;
  open: boolean;
  closeModal: () => void;
}

const emptyExhibition: Exhibition = {
  type: 'Exhibition',
  name: '',
  organizer: '',
  place: { type: 'UnconfirmedPlace', label: '', country: '' },
  date: { type: 'Period', from: '', to: '' },
  otherInformation: '',
  sequence: 0,
};

export const ExhibitionModal = ({ exhibition, onSubmit, open, closeModal }: ExhibitionModalProps) => {
  const { t } = useTranslation('registration');

  return (
    <Dialog open={open} onClose={closeModal}>
      <DialogTitle>
        {exhibition ? t('resource_type.artistic.edit_exhibition') : t('resource_type.artistic.add_exhibition')}
      </DialogTitle>
      <Formik
        initialValues={exhibition ?? emptyExhibition}
        validationSchema={null} //TODO
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        <Form noValidate>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field name="name">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('resource_type.artistic.exhibition_title')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
            <Field name="place.label">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('common:place')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
            <Field name="organizer">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('resource_type.organizer')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
            <Box sx={{ display: 'flex', gap: '3rem' }}>
              <PeriodFields fromFieldName="time.from" toFieldName="time.to" />
            </Box>
            <Field name="otherInformation">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('common:other')}
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
            <Button variant="contained" type="submit">
              {exhibition ? t('common:save') : t('common:add')}
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
