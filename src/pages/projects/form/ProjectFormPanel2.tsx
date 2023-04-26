import { Autocomplete, Box, TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { cristinCategories } from '../../../resources/cristinCategories';
import { cristinKeywords } from '../../../resources/cristinKeywords';
import { TypedLabel } from '../../../types/project.types';
import { getLanguageString } from '../../../utils/translation-helpers';
import { ProjectFieldName } from './ProjectFormDialog';
import { RelatedProjectsField } from './RelatedProjectsField';
import { dataTestId } from '../../../utils/dataTestIds';

export const ProjectFormPanel2 = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
      <Field
        name={ProjectFieldName.Categories}
        data-testid={dataTestId.registrationWizard.description.projectForm.projectCategoryField}>
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

      <Field
        name={ProjectFieldName.Keywords}
        data-testid={dataTestId.registrationWizard.description.projectForm.keywordsField}>
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

      <Field
        name={ProjectFieldName.AcademicSummaryNo}
        data-testid={dataTestId.registrationWizard.description.projectForm.scentificSummaryNorwegianField}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            value={field.value ?? ''}
            variant="filled"
            fullWidth
            multiline
            rows="4"
            label={t('project.scientific_summary_norwegian')}
          />
        )}
      </Field>
      <Field
        name={ProjectFieldName.PopularScientificSummaryNo}
        data-testid={dataTestId.registrationWizard.description.projectForm.popularScienceSummaryNorwegianField}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            value={field.value ?? ''}
            variant="filled"
            fullWidth
            multiline
            rows="4"
            label={t('project.popular_science_summary_norwegian')}
          />
        )}
      </Field>
      <Field
        name={ProjectFieldName.AcademicSummaryEn}
        data-testid={dataTestId.registrationWizard.description.projectForm.scentificSummaryEnglishField}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            value={field.value ?? ''}
            variant="filled"
            fullWidth
            multiline
            rows="4"
            label={t('project.scientific_summary_english')}
          />
        )}
      </Field>
      <Field
        name={ProjectFieldName.PopularScientificSummaryEn}
        data-testid={dataTestId.registrationWizard.description.projectForm.popularScienceSummaryEnglishField}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            value={field.value ?? ''}
            variant="filled"
            fullWidth
            multiline
            rows="4"
            label={t('project.popular_science_summary_english')}
          />
        )}
      </Field>
      <RelatedProjectsField />
    </Box>
  );
};
