import { Box, TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { PublisherField } from '../../components/PublisherField';

export const SoftwareSourceCodeForm = () => {
  const { t } = useTranslation();

  return (
    <>
      <PublisherField />

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '1rem' }}>
        <Field name={ResourceFieldNames.PublicationInstanceCodeRepository}>
          {({ field, meta: { touched, error } }: FieldProps<string>) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              fullWidth
              data-testid={dataTestId.registrationWizard.resourceType.codeRepositoryField}
              variant="filled"
              label={t('registration.resource_type.research_data.repository_url')}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>

        <Field name={ResourceFieldNames.PublicationInstanceSoftwareVersion}>
          {({ field, meta: { touched, error } }: FieldProps<string>) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              required
              fullWidth
              data-testid={dataTestId.registrationWizard.resourceType.versionField}
              variant="filled"
              label={t('registration.resource_type.research_data.version')}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
      </Box>
    </>
  );
};
