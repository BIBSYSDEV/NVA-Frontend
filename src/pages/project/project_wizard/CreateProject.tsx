import { Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../components/PageHeader';
import { StyledPageContent } from '../../../components/styled/Wrappers';
import { CristinProject } from '../../../types/project.types';
import { EmptyProjectForm } from './EmptyProjectForm';
import { NFRProject } from './NFRProject';
import { ProjectForm } from './ProjectForm';

const CreateProject = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [showProjectForm, setShowProjectForm] = useState<boolean>(false);

  return (
    <StyledPageContent>
      {showProjectForm ? (
        <ProjectForm project={{ title: title } as CristinProject} />
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
            <NFRProject />
            <EmptyProjectForm title={title} setTitle={setTitle} setShowProjectForm={setShowProjectForm} />
          </Box>
        </>
      )}
    </StyledPageContent>
  );
};

export default CreateProject;
