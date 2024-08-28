import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { PageHeader } from '../../../components/PageHeader';
import { StyledPageContent, WizardStartPageWrapper } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { emptyProject } from '../../../types/project.types';
import { CreateNfrProject } from './CreateNfrProject';
import { EmptyProjectForm } from './EmptyProjectForm';
import { ProjectForm } from './ProjectForm';

const CreateProject = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId ?? '';
  const currentInstitutionQuery = useFetchOrganization(topOrgCristinId);
  const [newProject, setNewProject] = useState(emptyProject);
  const [showProjectForm, setShowProjectForm] = useState(false);

  return (
    <StyledPageContent>
      {showProjectForm ? (
        <ProjectForm project={newProject} />
      ) : (
        <>
          <PageHeader>{t('project.create_project')}</PageHeader>
          <WizardStartPageWrapper>
            <CreateNfrProject
              newProject={newProject}
              setNewProject={setNewProject}
              setShowProjectForm={setShowProjectForm}
              coordinatingInstitution={currentInstitutionQuery.data ?? emptyProject.coordinatingInstitution}
            />
            <EmptyProjectForm
              newProject={newProject}
              setNewProject={setNewProject}
              setShowProjectForm={setShowProjectForm}
            />
          </WizardStartPageWrapper>
        </>
      )}
    </StyledPageContent>
  );
};

export default CreateProject;
