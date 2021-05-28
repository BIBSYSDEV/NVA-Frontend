import { CircularProgress } from '@material-ui/core';
import { useLocation } from 'react-router';
import { PageHeader } from '../../components/PageHeader';
import { CristinProject } from '../../types/project.types';
import { useFetch } from '../../utils/hooks/useFetch';

const ProjectsPage = () => {
  const location = useLocation();
  const projectId = new URLSearchParams(location.search).get('id');
  const [project, isLoadingProject] = useFetch<CristinProject>(projectId);

  return isLoadingProject ? (
    <CircularProgress />
  ) : project ? (
    <>
      <PageHeader>{project.title}</PageHeader>
    </>
  ) : null;
};

export default ProjectsPage;
