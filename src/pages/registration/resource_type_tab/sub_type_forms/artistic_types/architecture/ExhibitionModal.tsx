import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box } from '@mui/material';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import { Exhibition } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
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

const validationSchema = Yup.object<YupShape<Exhibition>>({
  name: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.artistic.exhibition_title'),
    })
  ),
  organizer: Yup.string().required(
    i18n.t('feedback.validation.is_required', {
      field: i18n.t('registration.resource_type.organizer'),
    })
  ),
  place: Yup.object().shape({
    label: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('common.place'),
      })
    ),
  }),
  date: Yup.object().shape({
    from: Yup.date().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('registration.resource_type.date_from'),
      })
    ),
    to: Yup.date().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('registration.resource_type.date_to'),
      })
    ),
  }),
});

export const ExhibitionModal = ({ exhibition, onSubmit, open, closeModal }: ExhibitionModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal}>
      <DialogTitle>
        {exhibition
          ? t('registration.resource_type.artistic.edit_exhibition')
          : t('registration.resource_type.artistic.add_exhibition')}
      </DialogTitle>
      <Formik
        initialValues={exhibition ?? emptyExhibition}
        validationSchema={validationSchema}
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
                  label={t('registration.resource_type.artistic.exhibition_title')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                  data-testid={dataTestId.registrationWizard.resourceType.exhibitionName}
                />
              )}
            </Field>
            <Field name="place.label">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('common.place')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                  data-testid={dataTestId.registrationWizard.resourceType.exhibitionPlace}
                />
              )}
            </Field>
            <Field name="organizer">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('registration.resource_type.organizer')}
                  required
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                  data-testid={dataTestId.registrationWizard.resourceType.exhibitionOrganizer}
                />
              )}
            </Field>
            <Box sx={{ display: 'flex', gap: '3rem' }}>
              <PeriodFields fromFieldName="date.from" toFieldName="date.to" />
            </Box>
            <Field name="otherInformation">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label={t('common.other')}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                  data-testid={dataTestId.registrationWizard.resourceType.exhibitionOther}
                />
              )}
            </Field>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={closeModal}
              data-testid={dataTestId.registrationWizard.resourceType.exhibitionCancelButton}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="contained"
              type="submit"
              data-testid={dataTestId.registrationWizard.resourceType.exhibitionSaveButton}>
              {exhibition ? t('common.save') : t('common.add')}
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
