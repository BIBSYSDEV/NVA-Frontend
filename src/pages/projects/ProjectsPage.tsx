import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { PageSpinner } from '../../components/PageSpinner';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { CristinProject } from '../../types/project.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { ProjectLandingPage } from './ProjectLandingPage';

const ProjectsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const projectId = new URLSearchParams(location.search).get('id') ?? '';
  const [project, isLoadingProject] = useFetch<CristinProject>({ url: projectId });

  return (
    <StyledPageContent>
      {isLoadingProject ? (
        <PageSpinner aria-label={t('project.project')} />
      ) : (
        project && <ProjectLandingPage project={project} />
      )}
    </StyledPageContent>
  );
};

export default ProjectsPage;
