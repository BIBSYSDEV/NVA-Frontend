import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { useFetchProjectCategoriesQuery } from '../../../api/hooks/useFetchProjectCategoriesQuery';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ProjectFieldName, ProjectOrganization, SaveCristinProject, TypedLabel } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { OrganizationSearchField } from '../../basic_data/app_admin/OrganizationSearchField';
import { ProjectFundingsField } from './ProjectFundingsField';
import { FormBox } from './styles';

interface ProjectDescriptionFormProps {
  thisIsRekProject: boolean;
}

export const ProjectDetailsForm = ({ thisIsRekProject }: ProjectDescriptionFormProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue, setFieldTouched, touched, errors } = useFormikContext<SaveCristinProject>();

  const fetchProjectCategoriesQuery = useFetchProjectCategoriesQuery();

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormBox>
          <Typography variant="h2">{t('project.coordinating_institution')}</Typography>
          <Field name={ProjectFieldName.CoordinatingInstitution}>
            {({ field }: FieldProps<ProjectOrganization>) => (
              <OrganizationSearchField
                disabled={thisIsRekProject}
                label={t('project.coordinating_institution')}
                onChange={(selectedInstitution) => {
                  const selectedCoordinatingInstitution: ProjectOrganization = {
                    type: 'Organization',
                    id: selectedInstitution?.id ?? '',
                    labels: selectedInstitution?.labels ?? {},
                  };
                  setFieldValue(field.name, selectedCoordinatingInstitution);
                }}
                errorMessage={
                  touched.coordinatingInstitution?.id && !!errors.coordinatingInstitution?.id
                    ? errors.coordinatingInstitution?.id
                    : undefined
                }
                fieldInputProps={{
                  ...field,
                  onBlur: () => {
                    setFieldTouched(`${field.name}.id`);
                  },
                }}
                selectedValue={field.value}
                customDataTestId={dataTestId.registrationWizard.description.projectForm.coordinatingInstitutionField}
              />
            )}
          </Field>
        </FormBox>
        <FormBox>
          <Typography variant="h2">{t('project.form.category')}</Typography>
          <Field name={ProjectFieldName.Categories}>
            {({ field }: FieldProps<TypedLabel[]>) => (
              <Autocomplete
                options={fetchProjectCategoriesQuery.data?.hits ?? []}
                multiple
                loading={fetchProjectCategoriesQuery.isLoading}
                data-testid={dataTestId.projectWizard.detailsPanel.projectCategoryField}
                getOptionLabel={(option) => getLanguageString(option.label)}
                isOptionEqualToValue={(option, value) => option.type === value.type}
                value={field.value}
                onChange={(_, value) => setFieldValue(field.name, value)}
                renderInput={(params) => (
                  <TextField {...params} variant="filled" label={t('project.project_category')} />
                )}
              />
            )}
          </Field>
        </FormBox>
        <FormBox sx={{ gap: '0.5rem' }}>
          <Typography variant="h2" sx={{ marginBottom: '1rem' }}>
            {t('project.form.add_financing')}
          </Typography>
          <Trans i18nKey="project.form.add_financing_description" components={[<Typography key="1" />]} />
          <ProjectFundingsField currentFundings={values.funding} />
        </FormBox>
      </Box>
    </ErrorBoundary>
  );
};
