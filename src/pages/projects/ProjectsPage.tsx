import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { useLocation } from 'react-router';
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
      {isLoadingProject ? <CircularProgress /> : project ? <ProjectLandingPage project={project} /> : null}
    </StyledPageWrapperWithMaxWidth>
  );
};

export default ProjectsPage;
