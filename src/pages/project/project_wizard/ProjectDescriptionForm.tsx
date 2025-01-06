import ErrorIcon from '@mui/icons-material/Error';
import { Autocomplete, Box, CircularProgress, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDuplicateProjectSearch } from '../../../api/hooks/useDuplicateProjectSearch';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { cristinKeywords } from '../../../resources/cristinKeywords';
import { CristinProject, ProjectFieldName, TypedLabel } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getLanguageString } from '../../../utils/translation-helpers';
import { getProjectPath } from '../../../utils/urlPaths';
import { DuplicateWarning } from '../../registration/DuplicateWarning';
import { FormBox } from './styles';

interface ProjectDescriptionFormProps {
  thisIsRekProject: boolean;
}

export const ProjectDescriptionForm = ({ thisIsRekProject }: ProjectDescriptionFormProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue, setFieldTouched } = useFormikContext<CristinProject>();
  const debouncedTitle = useDebounce(values.title);
  const duplicateProjectSearch = useDuplicateProjectSearch({ title: debouncedTitle, id: values.id });

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormBox>
          <Typography variant="h2">{t('project.form.title_and_description')}</Typography>
          <Field name={ProjectFieldName.Title}>
            {({ field, meta: { touched, error } }: FieldProps<string>) => (
              <TextField
                {...field}
                data-testid={dataTestId.projectWizard.descriptionPanel.titleField}
                label={t('common.title')}
                disabled={thisIsRekProject}
                required
                variant="filled"
                fullWidth
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
                slotProps={{
                  input: {
                    endAdornment: duplicateProjectSearch.isPending ? (
                      <CircularProgress size={20} />
                    ) : duplicateProjectSearch.duplicateProject ? (
                      <ErrorIcon color="warning" />
                    ) : undefined,
                  },
                }}
              />
            )}
          </Field>
          {duplicateProjectSearch.duplicateProject && (
            <DuplicateWarning
              sx={{ padding: 0 }}
              name={duplicateProjectSearch.duplicateProject.title}
              linkTo={getProjectPath(duplicateProjectSearch.duplicateProject.id)}
              warning={t('project.duplicate_title_warning')}
              listHeader={t('project.duplicate_project_heading')}
            />
          )}
          <Field name={ProjectFieldName.AcademicSummaryNo}>
            {({ field }: FieldProps<string>) => (
              <TextField
                {...field}
                value={field.value ?? ''}
                variant="filled"
                fullWidth
                multiline
                rows="4"
                data-testid={dataTestId.projectWizard.descriptionPanel.scientificSummaryNorwegianField}
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
                data-testid={dataTestId.projectWizard.descriptionPanel.scientificSummaryEnglishField}
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
                data-testid={dataTestId.projectWizard.descriptionPanel.popularScienceSummaryNorwegianField}
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
                data-testid={dataTestId.projectWizard.descriptionPanel.popularScienceSummaryEnglishField}
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
                data-testid={dataTestId.projectWizard.descriptionPanel.keywordsField}
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
                    if (!touched) {
                      setFieldTouched(field.name, true, false);
                    }
                    setFieldValue(field.name, date ?? '');
                  }}
                  value={field.value ? new Date(field.value) : null}
                  maxDate={values.endDate ? new Date(values.endDate) : undefined}
                  slotProps={{
                    textField: {
                      inputProps: {
                        'data-testid': dataTestId.projectWizard.descriptionPanel.startDateField,
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
                    if (!touched) {
                      setFieldTouched(field.name, true, false);
                    }
                    setFieldValue(field.name, date);
                  }}
                  value={field.value ? new Date(field.value) : null}
                  minDate={values.startDate ? new Date(values.startDate) : undefined}
                  slotProps={{
                    textField: {
                      inputProps: { 'data-testid': dataTestId.projectWizard.descriptionPanel.endDateField },
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
