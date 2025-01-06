import { Box, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../../translations/i18n';
import { emptyPeriod, emptyPlace } from '../../../../../../types/common.types';
import { Exhibition } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { periodField } from '../../../../../../utils/validation/registration/referenceValidation';
import { YupShape } from '../../../../../../utils/validation/validationHelpers';
import { PeriodFields } from '../../../components/PeriodFields';
import { OutputModalActions } from '../OutputModalActions';

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
  place: emptyPlace,
  date: emptyPeriod,
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
    name: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('common.place'),
      })
    ),
  }),
  date: periodField,
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
        {({ isSubmitting }: FormikProps<Exhibition>) => (
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
              <Field name="place.name">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('common.place')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    data-testid={dataTestId.registrationWizard.resourceType.placeField}
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
            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!exhibition} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
