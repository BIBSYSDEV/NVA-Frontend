import { Box, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../../translations/i18n';
import { emptyPeriod, emptyPlace } from '../../../../../types/common.types';
import { ExhibitionBasic } from '../../../../../types/publication_types/exhibitionContent.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { periodField } from '../../../../../utils/validation/registration/referenceValidation';
import { PeriodFields } from '../../components/PeriodFields';
import { OutputModalActions } from '../artistic_types/OutputModalActions';

interface ExhibitionBasicModalProps {
  exhibitionBasic?: ExhibitionBasic;
  onSubmit: (exhibitionBasic: ExhibitionBasic) => void;
  open: boolean;
  closeModal: () => void;
}

const validationSchema = Yup.object({
  organization: Yup.object({
    name: Yup.string().required(
      i18n.t('feedback.validation.is_required', {
        field: i18n.t('registration.resource_type.exhibition_production.institution_name'),
      })
    ),
  }),
  place: Yup.object().shape({
    name: Yup.string()
      .nullable()
      .required(
        i18n.t('feedback.validation.is_required', {
          field: i18n.t('registration.resource_type.exhibition_production.place'),
        })
      ),
  }),
  date: periodField,
});

const emptyExhibitionBasic: ExhibitionBasic = {
  type: 'ExhibitionBasic',
  organization: {
    type: 'UnconfirmedOrganization',
    name: '',
  },
  place: emptyPlace,
  date: emptyPeriod,
};

export const ExhibitionBasicModal = ({ exhibitionBasic, onSubmit, open, closeModal }: ExhibitionBasicModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={closeModal}>
      <DialogTitle>
        {exhibitionBasic
          ? t('registration.resource_type.exhibition_production.edit_exhibition_basic')
          : t('registration.resource_type.exhibition_production.add_exhibition_basic')}
      </DialogTitle>
      <Formik
        initialValues={exhibitionBasic ?? emptyExhibitionBasic}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          closeModal();
        }}>
        {({ isSubmitting }: FormikProps<ExhibitionBasic>) => (
          <Form noValidate>
            <DialogContent>
              <Field name="organization.name">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    sx={{ mb: '1rem' }}
                    data-testid={dataTestId.registrationWizard.resourceType.exhibitionBasicNameField}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.exhibition_production.institution_name')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <Field name="place.name">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    data-testid={dataTestId.registrationWizard.resourceType.placeField}
                    variant="filled"
                    fullWidth
                    label={t('registration.resource_type.exhibition_production.place')}
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
            <OutputModalActions isSubmitting={isSubmitting} closeModal={closeModal} isAddAction={!exhibitionBasic} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
