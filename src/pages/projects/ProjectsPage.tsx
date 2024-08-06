import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useFetchProject } from '../../api/hooks/useFetchProject';
import { PageSpinner } from '../../components/PageSpinner';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { ProjectLandingPage } from './ProjectLandingPage';

const ProjectsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const projectId = new URLSearchParams(location.search).get('id') ?? '';
  const projectQuery = useFetchProject(projectId);

  return (
    <StyledPageContent>
      {projectQuery.isPending ? (
        <PageSpinner aria-label={t('project.project')} />
      ) : (
        projectQuery.data && <ProjectLandingPage project={projectQuery.data} refetchProject={projectQuery.refetch} />
      )}
    </StyledPageContent>
  );
};

export default ProjectsPage;
