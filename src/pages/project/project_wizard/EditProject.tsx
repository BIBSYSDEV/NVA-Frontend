import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useFetchProject } from '../../../api/hooks/useFetchProject';
import { PageSpinner } from '../../../components/PageSpinner';
import { StyledPageContent } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { IdentifierParams } from '../../../utils/urlPaths';
import { Forbidden } from '../../errorpages/Forbidden';
import { canEditProject } from '../../registration/description_tab/projects_field/projectHelpers';
import { ProjectForm } from './ProjectForm';

const EditProject = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();
  const projectQuery = useFetchProject(decodeURIComponent(identifier ?? ''));
  const project = projectQuery.data;
  const user = useSelector((store: RootState) => store.user);
  const userCanEditProject = canEditProject(user, project);

  return projectQuery.isPending ? (
    <PageSpinner aria-label={t('common.result')} />
  ) : !userCanEditProject ? (
    <Forbidden />
  ) : project ? (
    <StyledPageContent>
      <ProjectForm project={project} />
    </StyledPageContent>
  ) : null;
};

export default EditProject;
