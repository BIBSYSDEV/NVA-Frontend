import { Autocomplete, Box, TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { cristinCategories } from '../../../resources/cristinCategories';
import { cristinKeywords } from '../../../resources/cristinKeywords';
import { TypedLabel } from '../../../types/project.types';
import { getLanguageString } from '../../../utils/translation-helpers';
import { ProjectFieldName } from './ProjectFormDialog';
import { RelatedProjectsField } from './RelatedProjectsField';

export const ProjectFormPanel2 = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
      <Field name={ProjectFieldName.Categories}>
        {({ field, form: { setFieldValue } }: FieldProps<TypedLabel[]>) => (
          <Autocomplete
            options={cristinCategories}
            multiple
            getOptionLabel={(option) => getLanguageString(option.label)}
            isOptionEqualToValue={(option, value) => option.type === value.type}
            value={field.value}
            onChange={(_, value) => setFieldValue(field.name, value)}
            renderInput={(params) => <TextField {...params} variant="filled" label={t('project.project_category')} />}
          />
        )}
      </Field>

      <Field name={ProjectFieldName.Keywords}>
        {({ field, form: { setFieldValue } }: FieldProps<TypedLabel[]>) => (
          <Autocomplete
            options={cristinKeywords}
            multiple
            getOptionLabel={(option) => getLanguageString(option.label)}
            isOptionEqualToValue={(option, value) => option.type === value.type}
            value={field.value}
            onChange={(_, value) => setFieldValue(field.name, value)}
            renderInput={(params) => <TextField {...params} variant="filled" label={t('project.keywords')} />}
          />
        )}
      </Field>

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
      <RelatedProjectsField />
    </Box>
  );
};
