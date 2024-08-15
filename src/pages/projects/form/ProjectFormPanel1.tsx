import AddCircleIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Button, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  CristinProject,
  emptyProjectContributor,
  ProjectFieldName,
  ProjectOrganization,
  SaveCristinProject,
} from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { OrganizationSearchField } from '../../basic_data/app_admin/OrganizationSearchField';
import { ProjectContributorRow } from '../../registration/description_tab/projects_field/ProjectContributorRow';
import { isProjectManager, isRekProject } from '../../registration/description_tab/projects_field/projectHelpers';
import { ProjectContributors } from './ProjectContributors';
import { ProjectFundingsField } from './ProjectFunding';

interface ProjectFormPanel1Props {
  currentProject?: CristinProject;
  suggestedProjectManager?: string;
}

export const ProjectFormPanel1 = ({ currentProject, suggestedProjectManager }: ProjectFormPanel1Props) => {
  const { t } = useTranslation();
  const { values, setFieldValue, setFieldTouched, touched, errors } = useFormikContext<SaveCristinProject>();

  const thisIsRekProject = isRekProject(currentProject);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mb: '1rem' }}>
        <Field name={ProjectFieldName.Title}>
          {({ field, meta: { touched, error } }: FieldProps<string>) => (
            <TextField
              {...field}
              data-testid={dataTestId.registrationWizard.description.projectForm.titleField}
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
                    inputProps: { 'data-testid': dataTestId.registrationWizard.description.projectForm.startDateField },
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
                    inputProps: { 'data-testid': dataTestId.registrationWizard.description.projectForm.endDateField },
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
      </Box>

      <Typography variant="h3" gutterBottom>
        {t('project.project_participants')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: { xs: '1.25rem', sm: '0.5rem' },
        }}>
        {suggestedProjectManager && (
          <Typography>{t('project.project_manager_from_nfr', { name: suggestedProjectManager })}</Typography>
        )}
        <ProjectContributors currentProject={currentProject} />
        <FieldArray name={ProjectFieldName.Contributors}>
          {({ name, push, remove }: FieldArrayRenderProps) => (
            <>
              {values.contributors.map((contributor, index) => {
                const thisContributor =
                  contributor.identity.id &&
                  currentProject?.contributors[index] &&
                  contributor.identity.id === currentProject.contributors[index].identity.id
                    ? currentProject.contributors[index]
                    : undefined;
                return (
                  <ProjectContributorRow
                    key={index}
                    contributorIndex={index}
                    baseFieldName={`${name}[${index}]`}
                    contributor={thisContributor}
                    removeContributor={isProjectManager(contributor) ? undefined : () => remove(index)}
                    isRekProject={thisIsRekProject}
                  />
                );
              })}
              <Button
                startIcon={<AddCircleIcon />}
                onClick={() => push(emptyProjectContributor)}
                sx={{ width: 'fit-content' }}
                data-testid={dataTestId.registrationWizard.description.projectForm.addParticipantButton}>
                {t('common.add')}
              </Button>
            </>
          )}
        </FieldArray>

        <ProjectFundingsField currentFundings={values.funding} />
      </Box>
    </>
  );
};
