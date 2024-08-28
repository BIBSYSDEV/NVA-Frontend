import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchCurrentInstitution } from '../../../api/hooks/useFetchCurrentInstitution';
import { PageHeader } from '../../../components/PageHeader';
import { StyledPageContent, WizardStartPageWrapper } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { emptyProject, SaveCristinProject } from '../../../types/project.types';
import { EmptyProjectForm } from './EmptyProjectForm';
import { NFRProject } from './NFRProject';
import { ProjectForm } from './ProjectForm';

const CreateProject = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId ?? '';
  const currentInstitutionQuery = useFetchCurrentInstitution(topOrgCristinId);
  const [newProject, setNewProject] = useState<SaveCristinProject>({ ...emptyProject });
  const [showProjectForm, setShowProjectForm] = useState<boolean>(false);

  return (
    <StyledPageContent>
      {showProjectForm ? (
        <ProjectForm project={newProject} />
      ) : (
        <>
          <PageHeader>{t('project.create_project')}</PageHeader>
          <WizardStartPageWrapper>
            <NFRProject
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
