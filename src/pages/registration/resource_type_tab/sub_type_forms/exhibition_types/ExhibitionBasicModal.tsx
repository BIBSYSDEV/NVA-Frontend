import { Box, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { Formik, FormikProps, Form, Field, FieldProps, ErrorMessage } from 'formik';
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
  title: Yup.string().required(
    i18n.t('translation:feedback.validation.is_required', {
      field: i18n.t('translation:registration.resource_type.exhibition_production.institution_name'),
    })
  ),
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

const emptyExhibitionBasic: ExhibitionBasic = {
  type: 'ExhibitionBasic',
  title: '',
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
              <Field name="title">
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
              <Field name="place.label">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    data-testid={dataTestId.registrationWizard.resourceType.exhibitionBasicPlaceField}
                    variant="filled"
                    fullWidth
                    label={t('common.place')}
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
