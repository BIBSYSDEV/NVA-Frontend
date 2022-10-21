import { Box, TextField, Typography } from '@mui/material';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../utils/dataTestIds';

export const JournalDetailsFields = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(4,1fr) auto 1fr' },
        gap: '1rem',
        alignItems: 'center',
      }}>
      <Field name={ResourceFieldNames.Volume}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <TextField
            {...field}
            id={field.name}
            value={field.value ?? ''}
            data-testid={dataTestId.registrationWizard.resourceType.volumeField}
            variant="filled"
            label={t('registration.resource_type.volume')}
            error={touched && !!error}
            helperText={<ErrorMessage name={field.name} />}
          />
        )}
      </Field>

      <Field name={ResourceFieldNames.Issue}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <TextField
            {...field}
            id={field.name}
            value={field.value ?? ''}
            data-testid={dataTestId.registrationWizard.resourceType.issueField}
            variant="filled"
            label={t('registration.resource_type.issue')}
            error={touched && !!error}
            helperText={<ErrorMessage name={field.name} />}
          />
        )}
      </Field>

      <Field name={ResourceFieldNames.PagesFrom}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <TextField
            {...field}
            id={field.name}
            data-testid={dataTestId.registrationWizard.resourceType.pagesFromField}
            value={field.value ?? ''}
            variant="filled"
            label={t('registration.resource_type.pages_from')}
            error={touched && !!error}
            helperText={<ErrorMessage name={field.name} />}
          />
        )}
      </Field>

      <Field name={ResourceFieldNames.PagesTo}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <TextField
            {...field}
            id={field.name}
            data-testid={dataTestId.registrationWizard.resourceType.pagesToField}
            variant="filled"
            label={t('registration.resource_type.pages_to')}
            value={field.value ?? ''}
            error={touched && !!error}
            helperText={<ErrorMessage name={field.name} />}
          />
        )}
      </Field>

      <Typography>{t('registration.resource_type.or')}</Typography>

      <Field name={ResourceFieldNames.ArticleNumber}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <TextField
            {...field}
            id={field.name}
            data-testid={dataTestId.registrationWizard.resourceType.articleNumberField}
            value={field.value ?? ''}
            variant="filled"
            label={t('registration.resource_type.article_number')}
            error={touched && !!error}
            helperText={<ErrorMessage name={field.name} />}
          />
        )}
      </Field>
    </Box>
  );
};
