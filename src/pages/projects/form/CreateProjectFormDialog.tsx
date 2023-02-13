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
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CristinApiPath } from '../../../api/apiPaths';
import { authenticatedApiRequest } from '../../../api/apiRequest';
import { setNotification } from '../../../redux/notificationSlice';
import { CristinProject, SaveCristinProject } from '../../../types/project.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { basicProjectValidationSchema } from '../../../utils/validation/project/BasicProjectValidation';
import { OrganizationSearchField } from '../../basic_data/app_admin/OrganizationSearchField';
import { ProjectContributorRow } from '../../registration/description_tab/projects_field/ProjectContributorRow';
import { getSimpleCristinProjectModel } from '../../registration/description_tab/projects_field/projectHelpers';

const initialValues: SaveCristinProject = {
  type: 'Project',
  title: '',
  language: 'http://lexvo.org/id/iso639-3/nob',
  startDate: '',
  endDate: '',
  contributors: [
    { type: 'ProjectManager', identity: { type: 'Person', id: '' }, affiliation: { type: 'Organization', id: '' } },
  ],
  coordinatingInstitution: {
    type: 'Organization',
    id: '',
  },
};

interface ProjectFormDialogProps extends DialogProps {
  onClose: () => void;
  currentProject?: CristinProject;
}

export const ProjectFormDialog = ({ currentProject, ...props }: ProjectFormDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const editMode = !!currentProject;

  const createProject = async (values: SaveCristinProject) => {
    if (editMode) {
      const createProjectResponse = await authenticatedApiRequest({
        url: currentProject.id,
        method: 'PATCH',
        data: values,
      });

      if (isSuccessStatus(createProjectResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.update_project'), variant: 'success' }));
        props.onClose();
      } else if (isErrorStatus(createProjectResponse.status)) {
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
        props.onClose();
      } else if (isErrorStatus(createProjectResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.create_project'), variant: 'error' }));
      }
    }
  };

  return (
    <Dialog maxWidth="md" fullWidth {...props}>
      <DialogTitle>{t('project.create_project')}</DialogTitle>

      <Formik
        initialValues={editMode ? getSimpleCristinProjectModel(currentProject) : initialValues}
        validationSchema={basicProjectValidationSchema}
        onSubmit={createProject}>
        {({ values, isSubmitting, setFieldValue, setFieldTouched }: FormikProps<SaveCristinProject>) => (
          <Form noValidate>
            {console.log(values)}
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Field name="title">
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
                <Field name="coordinatingInstitution.id">
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <OrganizationSearchField
                      label={t('project.coordinating_institution')}
                      onChange={(selectedInstitution) => setFieldValue(field.name, selectedInstitution?.id ?? '')}
                      errorMessage={touched && !!error ? error : undefined}
                      fieldInputProps={field}
                    />
                  )}
                </Field>

                <Box sx={{ display: 'flex', gap: '1rem' }}>
                  <Field name="startDate">
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

                  <Field name="endDate">
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
              <ProjectContributorRow />
            </DialogContent>

            <DialogActions>
              <Button onClick={props.onClose}>{t('common.cancel')}</Button>
              <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                {t('common.save')}
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
