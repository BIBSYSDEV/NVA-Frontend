import React from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Link, MuiThemeProvider, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import styled from 'styled-components';
import lightTheme from '../../themes/lightTheme';
import { CristinProject, ResearchProject } from '../../types/project.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { getProjectPath } from '../../utils/urlPaths';
import {
  getProjectManagerName,
  getProjectName,
  getProjectPeriod,
} from '../registration/description_tab/projects_field/projectHelpers';

const StyledProjectRow = styled.div`
  background: ${({ theme }) => theme.palette.background.default};
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 2fr auto 1fr auto 1fr auto 1fr;
  column-gap: 1rem;
  align-items: center;
`;

const StyledProjectTitle = styled(Typography)`
  font-weight: 500;
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
  const { t } = useTranslation('registration');
  const [fetchedProject, isLoadingProject] = useFetch<CristinProject>(project.id);

  const projectTitle = fetchedProject?.title ?? project.name;

  return (
    <StyledProjectRow>
      {isLoadingProject ? (
        <Skeleton />
      ) : (
        <StyledProjectTitle variant="body1" variantMapping={{ body1: 'h3' }}>
          {fetchedProject?.id ? <Link href={getProjectPath(fetchedProject.id)}>{projectTitle}</Link> : projectTitle}
        </StyledProjectTitle>
      )}
      <Divider component="span" orientation="vertical" />
      {isLoadingProject ? <Skeleton /> : <Typography variant="body1">{getProjectName(fetchedProject)}</Typography>}
      <Divider component="span" orientation="vertical" />
      {isLoadingProject ? (
        <Skeleton />
      ) : (
        <Typography variant="body1">{getProjectManagerName(fetchedProject)}</Typography>
      )}
      <Divider component="span" orientation="vertical" />
      {isLoadingProject ? (
        <Skeleton />
      ) : fetchedProject ? (
        <div>
          <Typography variant="body1">{getProjectPeriod(fetchedProject)}</Typography>
          <Typography variant="body1">
            {t('public_page.participants', { count: fetchedProject?.contributors.length })}
          </Typography>
        </div>
      ) : null}
    </StyledProjectRow>
  );
};
