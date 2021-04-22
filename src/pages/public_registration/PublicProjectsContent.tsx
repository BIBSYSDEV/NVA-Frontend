import React from 'react';
import { useTranslation } from 'react-i18next';
import { MuiThemeProvider, Typography } from '@material-ui/core';
import styled from 'styled-components';
import lightTheme from '../../themes/lightTheme';
import { CristinProject, ResearchProject } from '../../types/project.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { Skeleton } from '@material-ui/lab';

const StyledProjectRow = styled.div`
  background: ${({ theme }) => theme.palette.background.default};
  padding: 1rem;
`;

interface PublicProjectsContentProps {
  projects: ResearchProject[];
}

export const PublicProjectsContent = ({ projects }: PublicProjectsContentProps) => {
  const { t } = useTranslation('registration');

  return (
    <>
      <Typography variant="h4" component="h2" gutterBottom>
        {t('registration:description.project_association')}
      </Typography>

      <MuiThemeProvider theme={lightTheme}>
        {projects.map((project) => (
          <ProjectRow key={project.id} project={project} />
        ))}
      </MuiThemeProvider>
    </>
  );
};

interface ProjectRowProps {
  project: ResearchProject;
}

const ProjectRow = ({ project }: ProjectRowProps) => {
  const [fetchedProject, isLoadingProject] = useFetch<CristinProject>(project.id, true); // TODO: remove auth

  return (
    <StyledProjectRow>
      {isLoadingProject ? <Skeleton /> : fetchedProject ? <Typography>{fetchedProject.title}</Typography> : null}
    </StyledProjectRow>
  );
};
