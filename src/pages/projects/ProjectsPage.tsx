import React from 'react';
import { useLocation } from 'react-router';
import { PageSpinner } from '../../components/PageSpinner';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { CristinProject } from '../../types/project.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { ProjectLandingPage } from './ProjectLandingPage';

const ProjectsPage = () => {
  const location = useLocation();
  const projectId = new URLSearchParams(location.search).get('id') ?? '';
  const [project, isLoadingProject] = useFetch<CristinProject>(projectId);

  return (
    <StyledPageWrapperWithMaxWidth>
      {isLoadingProject ? <PageSpinner /> : project && <ProjectLandingPage project={project} />}
    </StyledPageWrapperWithMaxWidth>
  );
};

export default ProjectsPage;
