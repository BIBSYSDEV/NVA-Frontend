import { Box } from '@mui/material';
import { Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { authenticatedApiRequest2 } from '../../../api/apiRequest';
import { PageHeader } from '../../../components/PageHeader';
import { RequiredDescription } from '../../../components/RequiredDescription';
import { SkipLink } from '../../../components/SkipLink';
import { setNotification } from '../../../redux/notificationSlice';
import { CristinProject, ProjectTabs, SaveCristinProject } from '../../../types/project.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { basicProjectValidationSchema } from '../../../utils/validation/project/BasicProjectValidation';
import { InitialProjectFormData } from '../../projects/form/ProjectFormDialog';
import { isRekProject } from '../../registration/description_tab/projects_field/projectHelpers';
import { ProjectConnectionsForm } from './ProjectConnectionsForm';
import { ProjectContributorsForm } from './ProjectContributorsForm';
import { ProjectDescriptionForm } from './ProjectDescriptionForm';
import { ProjectDetailsForm } from './ProjectDetailsForm';
import { ProjectFormActions } from './ProjectFormActions';
import { ProjectFormStepper } from './ProjectFormStepper';

interface ProjectFormProps {
  project: CristinProject;
}

export const ProjectForm = ({ project }: ProjectFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [tabNumber, setTabNumber] = useState(ProjectTabs.Description);
  const [maxVisitedTab, setMaxVisitedTab] = useState(ProjectTabs.Description);
  const [initialValues] = useState<InitialProjectFormData>({ project: project });
  const thisIsRekProject = isRekProject(project);
  const isLastTab = tabNumber === ProjectTabs.Connections;

  const submitProjectForm = async (values: SaveCristinProject) => {
    const updateProjectResponse = await authenticatedApiRequest2<CristinProject>({
      url: project.id,
      method: 'PATCH',
      data: values,
    });

    if (isSuccessStatus(updateProjectResponse.status)) {
      dispatch(setNotification({ message: t('feedback.success.update_project'), variant: 'success' }));
      if (isLastTab) {
        /*if (history.location.state?.previousPath) {
          history.goBack();
        } else {
          history.push(getRegistrationLandingPagePath(values.identifier));
        }*/
      }
      //handleClose();
      // refetchData?.();
    } else if (isErrorStatus(updateProjectResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.update_project'), variant: 'error' }));
    }
  };

  return (
    <>
      <SkipLink href="#form">{t('common.skip_to_schema')}</SkipLink>
      <Formik
        initialValues={initialValues.project!}
        validationSchema={basicProjectValidationSchema}
        onSubmit={submitProjectForm}>
        {({ isSubmitting }: FormikProps<SaveCristinProject>) => {
          return (
            <Form noValidate>
              <PageHeader variant="h1">{project.title}</PageHeader>
              <ProjectFormStepper
                tabNumber={tabNumber}
                setTabNumber={setTabNumber}
                maxVisitedTab={maxVisitedTab}
                setMaxVisitedTab={setMaxVisitedTab}
              />
              <RequiredDescription />
              <Box sx={{ bgcolor: 'secondary.dark', padding: '0' }}>
                <Box id="form" sx={{ bgcolor: 'secondary.main', mb: '0.5rem', padding: '1.5rem 1.25rem' }}>
                  {tabNumber === ProjectTabs.Description && (
                    <ProjectDescriptionForm thisIsRekProject={thisIsRekProject} />
                  )}
                  {tabNumber === ProjectTabs.Details && <ProjectDetailsForm thisIsRekProject={thisIsRekProject} />}
                  {tabNumber === ProjectTabs.Contributors && <ProjectContributorsForm maxVisitedTab={maxVisitedTab} />}
                  {tabNumber === ProjectTabs.Connections && <ProjectConnectionsForm />}
                </Box>
                <ProjectFormActions tabNumber={tabNumber} setTabNumber={setTabNumber} isSaving={isSubmitting} />
              </Box>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
