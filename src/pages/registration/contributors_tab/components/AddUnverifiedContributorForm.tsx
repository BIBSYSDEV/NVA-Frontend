import { Box, Button, DialogActions, TextField, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18n from '../../../../translations/i18n';
import { Contributor, emptyContributor } from '../../../../types/contributor.types';
import { dataTestId } from '../../../../utils/dataTestIds';

const unverifiedContributorValidationSchema = Yup.object().shape({
  identity: Yup.object().shape({
    name: Yup.string().required(i18n.t('feedback.validation.is_required', { field: i18n.t('common.name') })),
  }),
});

interface AddUnverifiedContributorFormProps {
  addUnverifiedContributor: (newContributor: Contributor) => void;
  handleCloseModal: () => void;
  handleCancel: () => void;
  searchTerm: string;
}

export const AddUnverifiedContributorForm = ({
  addUnverifiedContributor,
  handleCloseModal,
  handleCancel,
  searchTerm = '',
}: AddUnverifiedContributorFormProps) => {
  const { t } = useTranslation();

  const handleSubmit = (values: Contributor) => {
    addUnverifiedContributor(values);
    handleCloseModal();
  };

  return (
    <Formik
      initialValues={{ ...emptyContributor, identity: { ...emptyContributor.identity, name: searchTerm } }}
      validationSchema={unverifiedContributorValidationSchema}
      onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '1rem' }}>
            <Typography>{t('registration.contributors.add_unverified_contributor')}</Typography>
            <Field name="identity.name">
              {({ field, meta: { error, touched } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  required
                  disabled={isSubmitting}
                  label={t('common.name')}
                  value={field.value ?? ''}
                  variant="filled"
                  placeholder={`${t('common.first_name')} ${t('common.last_name')}`}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                  data-testid={dataTestId.registrationWizard.contributors.unverifiedContributorName}
                />
              )}
            </Field>
          </Box>

          <DialogActions>
            <Button onClick={handleCancel}>{t('common.cancel')}</Button>
            <Button
              data-testid={dataTestId.registrationWizard.contributors.selectUserButton}
              type="submit"
              color="tertiary"
              variant="contained"
              loading={isSubmitting}>
              {t('registration.contributors.add_contributor')}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};
