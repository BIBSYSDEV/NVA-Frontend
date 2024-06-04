import { Autocomplete, Box, TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { cristinCategories } from '../../../resources/cristinCategories';
import { cristinKeywords } from '../../../resources/cristinKeywords';
import { ProjectFieldName, TypedLabel } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
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
            data-testid={dataTestId.registrationWizard.description.projectForm.projectCategoryField}
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
            data-testid={dataTestId.registrationWizard.description.projectForm.keywordsField}
            getOptionLabel={(option) => getLanguageString(option.label)}
            isOptionEqualToValue={(option, value) => option.type === value.type}
            value={field.value}
            onChange={(_, value) => setFieldValue(field.name, value)}
            renderInput={(params) => <TextField {...params} variant="filled" label={t('project.keywords')} />}
          />
        )}
      </Field>

      <Field name={ProjectFieldName.AcademicSummaryNo}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            value={field.value ?? ''}
            variant="filled"
            fullWidth
            multiline
            rows="4"
            data-testid={dataTestId.registrationWizard.description.projectForm.scentificSummaryNorwegianField}
            label={t('project.scientific_summary_norwegian')}
          />
        )}
      </Field>
      <Field name={ProjectFieldName.PopularScientificSummaryNo}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            value={field.value ?? ''}
            variant="filled"
            fullWidth
            multiline
            rows="4"
            data-testid={dataTestId.registrationWizard.description.projectForm.popularScienceSummaryNorwegianField}
            label={t('project.popular_science_summary_norwegian')}
          />
        )}
      </Field>
      <Field name={ProjectFieldName.AcademicSummaryEn}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            value={field.value ?? ''}
            variant="filled"
            fullWidth
            multiline
            rows="4"
            data-testid={dataTestId.registrationWizard.description.projectForm.scentificSummaryEnglishField}
            label={t('project.scientific_summary_english')}
          />
        )}
      </Field>
      <Field name={ProjectFieldName.PopularScientificSummaryEn}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            value={field.value ?? ''}
            variant="filled"
            fullWidth
            multiline
            rows="4"
            data-testid={dataTestId.registrationWizard.description.projectForm.popularScienceSummaryEnglishField}
            label={t('project.popular_science_summary_english')}
          />
        )}
      </Field>
      <RelatedProjectsField />
    </Box>
  );
};
