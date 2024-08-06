import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../components/PageHeader';
import { StyledPageContent } from '../../../components/styled/Wrappers';
import EmptyProjectForm from './EmptyProjectForm';
import NFRProject from './NFRProject';

const CreateProject = () => {
  const { t } = useTranslation();

  return (
    <StyledPageContent>
      <PageHeader>{t('project.create_project')}</PageHeader>
      <Box
        sx={{
          maxWidth: '55rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}>
        <NFRProject />
        <EmptyProjectForm />
      </Box>
    </StyledPageContent>
  );
};

export default CreateProject;
