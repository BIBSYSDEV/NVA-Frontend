import { Box } from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { authenticatedApiRequest2 } from '../../../api/apiRequest';
import { PageHeader } from '../../../components/PageHeader';
import { RequiredDescription } from '../../../components/RequiredDescription';
import { SkipLink } from '../../../components/SkipLink';
import { setNotification } from '../../../redux/notificationSlice';
import { CristinProject, ProjectTabs, SaveCristinProject } from '../../../types/project.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { getProjectPath } from '../../../utils/urlPaths';
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
  const history = useHistory();
  const [tabNumber, setTabNumber] = useState(ProjectTabs.Description);
  const [maxVisitedTab, setMaxVisitedTab] = useState(ProjectTabs.Connections); // TODO: Change for new project
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
        history.push(getProjectPath(project.id));
      }
    } else if (isErrorStatus(updateProjectResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.update_project'), variant: 'error' }));
    }
  };

  const cancelEdit = () => {
    history.goBack();
  };

  return (
    <>
      <SkipLink href="#form">{t('common.skip_to_schema')}</SkipLink>
      <Formik
        initialValues={initialValues.project!}
        validationSchema={basicProjectValidationSchema}
        onSubmit={submitProjectForm}>
        {() => {
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
                <ProjectFormActions tabNumber={tabNumber} setTabNumber={setTabNumber} cancelEdit={cancelEdit} />
              </Box>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
