import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { fetchProject } from '../../api/cristinApi';
import { PageSpinner } from '../../components/PageSpinner';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { ProjectLandingPage } from './ProjectLandingPage';

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const projectId = new URLSearchParams(location.search).get('id') ?? '';

  const projectQuery = useQuery({
    queryKey: [projectId],
    queryFn: () => fetchProject(projectId),
    meta: { errorMessage: t('feedback.error.get_project') },
  });

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
