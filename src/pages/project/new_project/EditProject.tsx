import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../components/PageHeader';
import { StyledPageContent } from '../../../components/styled/Wrappers';
import StartEmptyProject from './StartEmptyProject';

const EditProject = () => {
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
        <StartEmptyProject />
      </Box>
    </StyledPageContent>
  );
};

export default EditProject;
