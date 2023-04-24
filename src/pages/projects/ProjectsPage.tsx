import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { PageSpinner } from '../../components/PageSpinner';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { ProjectLandingPage } from './ProjectLandingPage';
import { fetchProject } from '../../api/cristinApi';
import { setNotification } from '../../redux/notificationSlice';

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const projectId = new URLSearchParams(location.search).get('id') ?? '';

  const projectQuery = useQuery({
    queryKey: [projectId],
    queryFn: () => fetchProject(projectId),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_project'), variant: 'error' })),
  });

  return (
    <StyledPageContent>
      {projectQuery.isLoading ? (
        <PageSpinner aria-label={t('project.project')} />
      ) : (
        projectQuery.data && <ProjectLandingPage project={projectQuery.data} refetchProject={projectQuery.refetch} />
      )}
    </StyledPageContent>
  );
};

export default ProjectsPage;
