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
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CristinApiPath } from '../../../../api/apiPaths';
import { authenticatedApiRequest } from '../../../../api/apiRequest';
import { setNotification } from '../../../../redux/notificationSlice';
import { PostCristinProject } from '../../../../types/project.types';
import { isErrorStatus, isSuccessStatus } from '../../../../utils/constants';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getNewDateValue } from '../../../../utils/registration-helpers';
import { basicProjectValidationSchema } from '../../../../utils/validation/project/BasicProjectValidation';
import { OrganizationSearchField } from '../../../basic_data/app_admin/OrganizationSearchField';
import { ProjectContributorRow } from './ProjectContributorRow';

const initialValues: PostCristinProject = {
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

interface CreateProjectDialogProps extends DialogProps {
  onClose: () => void;
}

export const CreateProjectDialog = (props: CreateProjectDialogProps) => {
  const { t } = useTranslation('project');
  const dispatch = useDispatch();

  const createProject = async (values: PostCristinProject) => {
    const createProjectResponse = await authenticatedApiRequest({
      url: CristinApiPath.Project,
      method: 'POST',
      data: values,
    });

    if (isSuccessStatus(createProjectResponse.status)) {
      dispatch(setNotification({ message: t('feedback:success.create_project'), variant: 'success' }));
      props.onClose();
    } else if (isErrorStatus(createProjectResponse.status)) {
      dispatch(setNotification({ message: t('feedback:error.create_project'), variant: 'error' }));
    }
  };

  return (
    <Dialog {...props}>
      <DialogTitle>{t('create_project')}</DialogTitle>

      <Formik initialValues={initialValues} validationSchema={basicProjectValidationSchema} onSubmit={createProject}>
        {({ isSubmitting, setFieldValue }) => (
          <Form noValidate>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Field name="title">
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <TextField
                      {...field}
                      data-testid={dataTestId.registrationWizard.description.projectForm.titleField}
                      label={t('common:title')}
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
                      label={t('project:coordinating_institution')}
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
                        label={t('common:start_date')}
                        onChange={(date: Date | null, keyboardValue) => {
                          const newDateString = getNewDateValue(date, keyboardValue);
                          setFieldValue(field.name, newDateString);
                        }}
                        value={field.value ? new Date(field.value) : null}
                        inputFormat="dd.MM.yyyy"
                        mask="__.__.____"
                        renderInput={(params) => (
                          <TextField
                            {...field}
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
                        label={t('common:end_date')}
                        onChange={(date: Date | null, keyboardValue) => {
                          const newDateString = getNewDateValue(date, keyboardValue);
                          setFieldValue(field.name, newDateString);
                        }}
                        value={field.value ? new Date(field.value) : null}
                        inputFormat="dd.MM.yyyy"
                        mask="__.__.____"
                        renderInput={(params) => (
                          <TextField
                            {...field}
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

              <Typography variant="h6" component="h3" gutterBottom sx={{ mt: '1rem' }}>
                {t('project_participants')}
              </Typography>
              <ProjectContributorRow />
            </DialogContent>

            <DialogActions>
              <Button onClick={props.onClose}>{t('common:cancel')}</Button>
              <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                {t('common:save')}
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
