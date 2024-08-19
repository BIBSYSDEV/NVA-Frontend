import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { cristinKeywords } from '../../../resources/cristinKeywords';
import { CristinProject, ProjectFieldName, SaveCristinProject, TypedLabel } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { isRekProject } from '../../registration/description_tab/projects_field/projectHelpers';
import { FormBox } from './styles';

interface ProjectDescriptionFormProps {
  project: CristinProject;
}

export const ProjectDescriptionForm = ({ project }: ProjectDescriptionFormProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue, setFieldTouched } = useFormikContext<SaveCristinProject>();
  const thisIsRekProject = isRekProject(project);

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormBox>
          <Typography variant="h2">{t('project.form.title_and_description')}</Typography>
          <Field name={ProjectFieldName.Title}>
            {({ field, meta: { touched, error } }: FieldProps<string>) => (
              <TextField
                {...field}
                data-testid={dataTestId.projectForm.titleField}
                label={t('common.title')}
                disabled={thisIsRekProject}
                required
                variant="filled"
                fullWidth
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
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
                data-testid={dataTestId.projectForm.scientificSummaryNorwegianField}
                label={t('project.scientific_summary_norwegian')}
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
                data-testid={dataTestId.projectForm.scientificSummaryEnglishField}
                label={t('project.scientific_summary_english')}
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
                rows="3"
                data-testid={dataTestId.projectForm.popularScienceSummaryNorwegianField}
                label={t('project.popular_science_summary_norwegian')}
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
                rows="3"
                data-testid={dataTestId.projectForm.popularScienceSummaryEnglishField}
                label={t('project.popular_science_summary_english')}
              />
            )}
          </Field>
        </FormBox>
        <FormBox>
          <Typography variant="h2">{t('project.form.keywords')}</Typography>
          <Field name={ProjectFieldName.Keywords}>
            {({ field, form: { setFieldValue } }: FieldProps<TypedLabel[]>) => (
              <Autocomplete
                options={cristinKeywords}
                multiple
                data-testid={dataTestId.projectForm.keywordsField}
                getOptionLabel={(option) => getLanguageString(option.label)}
                isOptionEqualToValue={(option, value) => option.type === value.type}
                value={field.value}
                onChange={(_, value) => setFieldValue(field.name, value)}
                renderInput={(params) => <TextField {...params} variant="filled" label={t('project.keywords')} />}
              />
            )}
          </Field>
        </FormBox>
        <FormBox>
          <Typography variant="h2" sx={{ pb: '0.25rem' }}>
            {t('project.form.date')}
          </Typography>
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Field name={ProjectFieldName.StartDate}>
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <DatePicker
                  label={t('common.start_date')}
                  disabled={thisIsRekProject}
                  onChange={(date) => {
                    !touched && setFieldTouched(field.name, true, false);
                    setFieldValue(field.name, date ?? '');
                  }}
                  value={field.value ? new Date(field.value) : null}
                  maxDate={values.endDate ? new Date(values.endDate) : undefined}
                  slotProps={{
                    textField: {
                      inputProps: {
                        'data-testid': dataTestId.projectForm.startDateField,
                      },
                      variant: 'filled',
                      onBlur: () => !touched && setFieldTouched(field.name),
                      required: true,
                      error: touched && !!error,
                      helperText: <ErrorMessage name={field.name} />,
                    },
                  }}
                />
              )}
            </Field>

            <Field name={ProjectFieldName.EndDate}>
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <DatePicker
                  label={t('common.end_date')}
                  disabled={thisIsRekProject}
                  onChange={(date) => {
                    !touched && setFieldTouched(field.name, true, false);
                    setFieldValue(field.name, date);
                  }}
                  value={field.value ? new Date(field.value) : null}
                  minDate={values.startDate ? new Date(values.startDate) : undefined}
                  slotProps={{
                    textField: {
                      inputProps: { 'data-testid': dataTestId.projectForm.endDateField },
                      variant: 'filled',
                      required: true,
                      error: touched && !!error,
                      helperText: <ErrorMessage name={field.name} />,
                    },
                  }}
                />
              )}
            </Field>
          </Box>
        </FormBox>
      </Box>
    </ErrorBoundary>
  );
};
