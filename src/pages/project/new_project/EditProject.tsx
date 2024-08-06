import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader';
import { StyledPageContent } from '../../../components/styled/Wrappers';
import { IdentifierParams } from '../../../utils/urlPaths';
import { CreateProjectPage } from './CreateProjectPage';
import ProjectForm from './ProjectForm';

const EditProject = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();

  return !identifier ? (
    <StyledPageContent>
      <PageHeader>{t('project.create_project')}</PageHeader>
      <Box
        sx={{
          maxWidth: '55rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}>
        <CreateProjectPage onClose={() => {}} setInitialValues={() => {}} />
      </Box>
    </StyledPageContent>
  ) : (
    <StyledPageContent>
      <ProjectForm onClose={() => {}} identifier={decodeURIComponent(identifier)} />
    </StyledPageContent>
  );
};

export default EditProject;
