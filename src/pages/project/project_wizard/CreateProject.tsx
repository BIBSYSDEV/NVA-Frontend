import { Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchCurrentInstitution } from '../../../api/hooks/useFetchCurrentInstitution';
import { PageHeader } from '../../../components/PageHeader';
import { StyledPageContent } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { CristinProject, emptyProject, SaveCristinProject } from '../../../types/project.types';
import { EmptyProjectForm } from './EmptyProjectForm';
import { NFRProject } from './NFRProject';
import { ProjectForm } from './ProjectForm';

const CreateProject = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId ?? '';
  const [newProject, setNewProject] = useState<SaveCristinProject>({ ...emptyProject });
  const [showProjectForm, setShowProjectForm] = useState<boolean>(false);

  const currentInstitutionQuery = useFetchCurrentInstitution(topOrgCristinId);

  return (
    <StyledPageContent>
      {showProjectForm ? (
        <ProjectForm project={newProject as CristinProject} />
      ) : (
        <>
          <PageHeader>{t('project.create_project')}</PageHeader>
          <Box
            sx={{
              maxWidth: '55rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}>
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
          </Box>
        </>
      )}
    </StyledPageContent>
  );
};

export default CreateProject;
