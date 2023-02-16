import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import AddCircleIcon from '@mui/icons-material/AddCircleOutline';
import { CristinApiPath } from '../../../api/apiPaths';
import { authenticatedApiRequest } from '../../../api/apiRequest';
import { setNotification } from '../../../redux/notificationSlice';
import { CristinProject, emptyProjectContributor, SaveCristinProject } from '../../../types/project.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { basicProjectValidationSchema } from '../../../utils/validation/project/BasicProjectValidation';
import { OrganizationSearchField } from '../../basic_data/app_admin/OrganizationSearchField';
import { ProjectContributorRow } from '../../registration/description_tab/projects_field/ProjectContributorRow';
import { CreateProjectStartPage } from './CreateProjectStartPage';

enum ProjectFieldName {
  Title = 'title',
  CoordinatingInstitutionId = 'coordinatingInstitution.id',
  Contributors = 'contributors',
  StartDate = 'startDate',
  EndDate = 'endDate',
}

interface ProjectFormDialogProps extends Pick<DialogProps, 'open'> {
  onClose: () => void;
  currentProject?: CristinProject;
  refetchData?: () => void;
}

export const ProjectFormDialog = ({ currentProject, refetchData, onClose, open }: ProjectFormDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState<CristinProject | SaveCristinProject | undefined>(currentProject);
  const editMode = !!currentProject;

  const submitProjectForm = async (values: SaveCristinProject) => {
    if (editMode) {
      const updateProjectResponse = await authenticatedApiRequest({
        url: currentProject.id,
        method: 'PATCH',
        data: values,
      });

      if (isSuccessStatus(updateProjectResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.update_project'), variant: 'success' }));
        onClose();
        refetchData?.();
      } else if (isErrorStatus(updateProjectResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_project'), variant: 'error' }));
      }
    } else {
      const createProjectResponse = await authenticatedApiRequest({
        url: CristinApiPath.Project,
        method: 'POST',
        data: values,
      });

      if (isSuccessStatus(createProjectResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.create_project'), variant: 'success' }));
        onClose();
      } else if (isErrorStatus(createProjectResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.create_project'), variant: 'error' }));
      }
    }
  };

  return (
    <Dialog maxWidth="md" fullWidth onClose={onClose} open={open}>
      <DialogTitle>{editMode ? t('project.edit_project') : t('project.create_project')}</DialogTitle>

      {!initialValues ? (
        <CreateProjectStartPage onClose={onClose} setInitialValues={setInitialValues} />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={basicProjectValidationSchema}
          onSubmit={submitProjectForm}>
          {({ values, isSubmitting, setFieldValue, setFieldTouched }: FormikProps<SaveCristinProject>) => (
            <Form noValidate>
              <DialogContent>
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
                    {({ name, push }: FieldArrayRenderProps) => (
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
              </DialogContent>

              <DialogActions>
                <Button onClick={onClose}>{t('common.cancel')}</Button>
                <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                  {t('common.save')}
                </LoadingButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
};
