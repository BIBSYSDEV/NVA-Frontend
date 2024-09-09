import { Box } from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CristinApiPath } from '../../../api/apiPaths';
import { authenticatedApiRequest2 } from '../../../api/apiRequest';
import { PageHeader } from '../../../components/page_layout_components/PageHeader';
import { RequiredDescription } from '../../../components/RequiredDescription';
import { SkipLink } from '../../../components/SkipLink';
import { TruncatableTypography } from '../../../components/TruncatableTypography';
import { setNotification } from '../../../redux/notificationSlice';
import { CristinProject, ProjectTabs, SaveCristinProject } from '../../../types/project.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { getProjectPath, UrlPathTemplate } from '../../../utils/urlPaths';
import { basicProjectValidationSchema } from '../../../utils/validation/project/BasicProjectValidation';
import { isRekProject } from '../../registration/description_tab/projects_field/projectHelpers';
import { ProjectIconHeader } from '../components/ProjectIconHeader';
import { ProjectConnectionsForm } from './ProjectConnectionsForm';
import { ProjectContributorsForm } from './ProjectContributorsForm';
import { ProjectDescriptionForm } from './ProjectDescriptionForm';
import { ProjectDetailsForm } from './ProjectDetailsForm';
import { ProjectFormActions } from './ProjectFormActions';
import { ProjectFormStepper } from './ProjectFormStepper';

interface ProjectFormProps {
  project: SaveCristinProject | CristinProject;
}

export const ProjectForm = ({ project }: ProjectFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tabNumber, setTabNumber] = useState(ProjectTabs.Description);
  const [maxVisitedTab, setMaxVisitedTab] = useState(ProjectTabs.Connections);

  const projectWithId = 'id' in project ? (project as CristinProject) : undefined;
  const thisIsRekProject = !!projectWithId && isRekProject(projectWithId);

  const goToLandingPage = (id: string) => {
    navigate(getProjectPath(id));
  };

  const submitProjectForm = async (values: SaveCristinProject) => {
    const config = {
      url: projectWithId ? projectWithId.id : CristinApiPath.Project,
      method: projectWithId ? 'PATCH' : 'POST',
      data: values,
    };

    const updateProjectResponse = await authenticatedApiRequest2<CristinProject>(config);

    if (isSuccessStatus(updateProjectResponse.status)) {
      dispatch(
        setNotification({
          message: projectWithId ? t('feedback.success.update_project') : t('feedback.success.create_project'),
          variant: 'success',
        })
      );
      const id = projectWithId ? projectWithId.id : updateProjectResponse.data.id;

      if (id) {
        goToLandingPage(id);
      }
    } else if (isErrorStatus(updateProjectResponse.status)) {
      dispatch(
        setNotification({
          message: projectWithId ? t('feedback.error.update_project') : t('feedback.error.create_project'),
          variant: 'error',
        })
      );
    }
  };

  const onCancel = () => {
    if (projectWithId) {
      goToLandingPage(projectWithId.id);
    } else {
      navigate(UrlPathTemplate.MyPageMyProjectRegistrations);
    }
  };

  return (
    <>
      <SkipLink href="#form">{t('common.skip_to_schema')}</SkipLink>
      <Formik initialValues={project} validationSchema={basicProjectValidationSchema} onSubmit={submitProjectForm}>
        <Form noValidate>
          <PageHeader>
            <ProjectIconHeader projectStatus={projectWithId ? projectWithId.status : undefined} />
            <TruncatableTypography variant="h1">{project.title}</TruncatableTypography>
          </PageHeader>
          <ProjectFormStepper
            tabNumber={tabNumber}
            setTabNumber={setTabNumber}
            maxVisitedTab={maxVisitedTab}
            setMaxVisitedTab={setMaxVisitedTab}
          />
          <RequiredDescription />
          <Box sx={{ bgcolor: 'secondary.dark', padding: '0' }}>
            <Box id="form" sx={{ bgcolor: 'secondary.main', mb: '0.5rem', padding: '1.5rem 1.25rem' }}>
              {tabNumber === ProjectTabs.Description && <ProjectDescriptionForm thisIsRekProject={thisIsRekProject} />}
              {tabNumber === ProjectTabs.Details && <ProjectDetailsForm thisIsRekProject={thisIsRekProject} />}
              {tabNumber === ProjectTabs.Contributors && <ProjectContributorsForm maxVisitedTab={maxVisitedTab} />}
              {tabNumber === ProjectTabs.Connections && <ProjectConnectionsForm />}
            </Box>
            <ProjectFormActions tabNumber={tabNumber} setTabNumber={setTabNumber} onCancel={onCancel} />
          </Box>
        </Form>
      </Formik>
    </>
  );
};
