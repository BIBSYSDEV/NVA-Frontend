import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useFetchProject } from '../../api/hooks/useFetchProject';
import { PageSpinner } from '../../components/PageSpinner';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { IdentifierParams } from '../../utils/urlPaths';
import { ProjectLandingPage } from './ProjectLandingPage';

const ProjectPage = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();

  const projectQuery = useFetchProject(identifier ?? '');

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

export default ProjectPage;
