import { Box } from '@mui/material';
import { Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CristinApiPath } from '../../../api/apiPaths';
import { authenticatedApiRequest2 } from '../../../api/apiRequest';
import { PageHeader } from '../../../components/page_layout_components/PageHeader';
import { RequiredDescription } from '../../../components/RequiredDescription';
import { SkipLink } from '../../../components/SkipLink';
import { TruncatableTypography } from '../../../components/TruncatableTypography';
import { setNotification } from '../../../redux/notificationSlice';
import { CristinProject, ProjectTabs, ResearchProject, SaveCristinProject } from '../../../types/project.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { getTouchedFields } from '../../../utils/formik-helpers/project-form-helpers';
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
  suggestedProjectManager?: string;
  toggleModal?: () => void;
  onProjectCreated?: (value: CristinProject | ResearchProject) => void;
}

export const ProjectForm = ({ project, suggestedProjectManager, toggleModal, onProjectCreated }: ProjectFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [tabNumber, setTabNumber] = useState(ProjectTabs.Description);
  const projectWithId = 'id' in project ? (project as CristinProject) : undefined;
  const [maxVisitedTab, setMaxVisitedTab] = useState(projectWithId ? ProjectTabs.Connections : ProjectTabs.Description);

  const thisIsRekProject = !!projectWithId && isRekProject(projectWithId);

  const goToLandingPage = (id: string) => {
    history.push(getProjectPath(id));
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

      if (toggleModal) {
        if (onProjectCreated) {
          if (projectWithId) onProjectCreated(projectWithId);
          else onProjectCreated(updateProjectResponse.data);
        }
        toggleModal();
      } else if (id) {
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
      history.push(UrlPathTemplate.MyPageMyProjectRegistrations);
    }
  };

  return (
    <>
      <SkipLink href="#form">{t('common.skip_to_schema')}</SkipLink>
      <Formik initialValues={project} validationSchema={basicProjectValidationSchema} onSubmit={submitProjectForm}>
        {({ setTouched, values }: FormikProps<SaveCristinProject>) => {
          const onTabChange = (tab: ProjectTabs) => {
            let maxTab;
            if (tab > maxVisitedTab) {
              maxTab = tab;
              setMaxVisitedTab(maxTab);
            } else {
              // We have gone to a previous tab - we want maxTab to be validated as well
              maxTab = maxVisitedTab + 1;
            }
            const touchedFields = getTouchedFields(maxTab, values);
            setTouched(touchedFields);
            setTabNumber(tab);
          };

          const onClickArrow = (newTab: ProjectTabs) => {
            setTabNumber(newTab);
            onTabChange(newTab);
          };

          return (
            <Form noValidate>
              <PageHeader>
                <ProjectIconHeader projectStatus={projectWithId ? projectWithId.status : undefined} />
                <TruncatableTypography variant="h1">{values.title}</TruncatableTypography>
              </PageHeader>
              <ProjectFormStepper tabNumber={tabNumber} onTabClicked={onTabChange} maxVisitedTab={maxVisitedTab} />
              <RequiredDescription />
              <Box sx={{ bgcolor: 'secondary.dark', padding: '0' }}>
                <Box id="form" sx={{ bgcolor: 'secondary.main', mb: '0.5rem', padding: '1.5rem 1.25rem' }}>
                  {tabNumber === ProjectTabs.Description && (
                    <ProjectDescriptionForm thisIsRekProject={thisIsRekProject} />
                  )}
                  {tabNumber === ProjectTabs.Details && <ProjectDetailsForm thisIsRekProject={thisIsRekProject} />}
                  {tabNumber === ProjectTabs.Contributors && (
                    <ProjectContributorsForm suggestedProjectManager={suggestedProjectManager} />
                  )}
                  {tabNumber === ProjectTabs.Connections && <ProjectConnectionsForm />}
                </Box>
                <ProjectFormActions
                  tabNumber={tabNumber}
                  onCancel={onCancel}
                  onClickNext={() => onClickArrow(tabNumber + 1)}
                  onClickPrevious={() => onClickArrow(tabNumber - 1)}
                  onClickLast={() => onClickArrow(ProjectTabs.Connections)}
                  openedInModal={toggleModal !== undefined}
                />
              </Box>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
