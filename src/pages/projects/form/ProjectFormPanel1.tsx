import { TextField, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { Field, FieldProps, ErrorMessage, FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircleOutline';
import { CristinProject, emptyProjectContributor, SaveCristinProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { OrganizationSearchField } from '../../basic_data/app_admin/OrganizationSearchField';
import { ProjectContributorRow } from '../../registration/description_tab/projects_field/ProjectContributorRow';
import { ProjectFieldName } from './ProjectFormDialog';

interface ProjectFormPanel1Props {
  currentProject?: CristinProject;
}

export const ProjectFormPanel1 = ({ currentProject }: ProjectFormPanel1Props) => {
  const { t } = useTranslation();
  const { values, setFieldValue, setFieldTouched } = useFormikContext<SaveCristinProject>();

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Field name={ProjectFieldName.Title}>
          {({ field, meta: { touched, error } }: FieldProps<string>) => (
            <TextField
              {...field}
              data-testid={dataTestId.registrationWizard.description.projectForm.titleField}
              label={t('common.title')}
              required
              variant="filled"
              fullWidth
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
        <Field name={ProjectFieldName.CoordinatingInstitutionId}>
          {({ field, meta: { touched, error } }: FieldProps<string>) => (
            <OrganizationSearchField
              label={t('project.coordinating_institution')}
              onChange={(selectedInstitution) => setFieldValue(field.name, selectedInstitution?.id ?? '')}
              errorMessage={touched && !!error ? error : undefined}
              fieldInputProps={field}
              currentValue={
                values.coordinatingInstitution.id &&
                currentProject?.coordinatingInstitution.id === values.coordinatingInstitution.id
                  ? {
                      id: values.coordinatingInstitution.id,
                      name: currentProject.coordinatingInstitution.name,
                    }
                  : undefined
              }
            />
          )}
        </Field>

        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Field name={ProjectFieldName.StartDate}>
            {({ field, meta: { touched, error } }: FieldProps<string>) => (
              <DatePicker
                label={t('common.start_date')}
                PopperProps={{
                  'aria-label': t('common.start_date'),
                }}
                onChange={(date) => {
                  !touched && setFieldTouched(field.name, true, false);
                  setFieldValue(field.name, date ?? '');
                }}
                value={field.value ? new Date(field.value) : null}
                maxDate={values.endDate}
                inputFormat="dd.MM.yyyy"
                mask="__.__.____"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    data-testid={dataTestId.registrationWizard.description.projectForm.startDateField}
                    variant="filled"
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              />
            )}
          </Field>

          <Field name={ProjectFieldName.EndDate}>
            {({ field, meta: { touched, error } }: FieldProps<string>) => (
              <DatePicker
                label={t('common.end_date')}
                PopperProps={{
                  'aria-label': t('common.end_date'),
                }}
                onChange={(date) => {
                  !touched && setFieldTouched(field.name, true, false);
                  setFieldValue(field.name, date);
                }}
                value={field.value ? new Date(field.value) : null}
                minDate={values.startDate}
                inputFormat="dd.MM.yyyy"
                mask="__.__.____"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    data-testid={dataTestId.registrationWizard.description.projectForm.endDateField}
                    variant="filled"
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              />
            )}
          </Field>
        </Box>
      </Box>

      <Typography variant="h3" gutterBottom sx={{ mt: '1rem' }}>
        {t('project.project_participants')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: { xs: '1.25rem', sm: '0.5rem' },
        }}>
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
                    baseFieldName={`${name}[${index}]`}
                    contributor={thisContributor}
                    removeContributor={() => remove(index)}
                  />
                );
              })}
              <Button
                startIcon={<AddCircleIcon />}
                onClick={() => push(emptyProjectContributor)}
                sx={{ width: 'fit-content', alignSelf: 'center' }}>
                {t('common.add')}
              </Button>
            </>
          )}
        </FieldArray>
      </Box>
    </>
  );
};
