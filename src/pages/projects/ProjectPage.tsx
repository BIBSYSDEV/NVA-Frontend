import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useFetchProject } from '../../api/hooks/useFetchProject';
import { PageWithRightSideMenu } from '../../components/page-layouts/PageWithRightSideMenu';
import { PageSpinner } from '../../components/PageSpinner';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { KbsActionPanel } from '../../kbs/kbs-action-panel/KbsActionPanel';
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
        projectQuery.data && (
          <PageWithRightSideMenu
            main={<ProjectLandingPage project={projectQuery.data} refetchProject={projectQuery.refetch} />}
            sidebar={<KbsActionPanel />}
          />
        )
      )}
    </StyledPageContent>
  );
};

export default ProjectPage;
