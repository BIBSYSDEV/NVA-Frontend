import { Box, TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { ProjectFieldName } from './ProjectFormDialog';

export const ProjectFormPanel2 = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
      <Field name={ProjectFieldName.AcademicSummary}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            value={field.value ?? ''}
            variant="filled"
            fullWidth
            multiline
            rows="4"
            label={t('project.scientific_summary')}
          />
        )}
      </Field>
      <Field name={ProjectFieldName.PopularScientificSummary}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            value={field.value ?? ''}
            variant="filled"
            fullWidth
            multiline
            rows="4"
            label={t('project.popular_science_summary')}
          />
        )}
      </Field>
    </Box>
  );
};
