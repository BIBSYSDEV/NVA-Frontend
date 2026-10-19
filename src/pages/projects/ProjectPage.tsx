import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useFetchProject } from '../../api/hooks/useFetchProject';
import { PageSpinner } from '../../components/PageSpinner';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { KbsProjectContent } from '../../kbs/KbsProjectContent';
import { IdentifierParams } from '../../utils/urlPaths';
import { ProjectLandingPage } from './ProjectLandingPage';

const ProjectPage = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();

  const projectQuery = useFetchProject(identifier ?? '');

  return projectQuery.isPending ? (
    <StyledPageContent>
      <PageSpinner aria-label={t('project.project')} />
    </StyledPageContent>
  ) : (
    projectQuery.data && (
      <KbsProjectContent>
        <ProjectLandingPage project={projectQuery.data} refetchProject={projectQuery.refetch} />
      </KbsProjectContent>
    )
  );
};

export default ProjectPage;
