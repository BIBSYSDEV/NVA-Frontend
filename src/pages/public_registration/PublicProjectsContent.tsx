import React from 'react';
import { useTranslation } from 'react-i18next';
import { MuiThemeProvider, Typography } from '@material-ui/core';
import styled from 'styled-components';
import lightTheme from '../../themes/lightTheme';
import { CristinProject, ResearchProject } from '../../types/project.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { Skeleton } from '@material-ui/lab';
import { getAffiliationLabel } from '../../utils/institutions-helpers';

const StyledProjectRow = styled.div`
  background: ${({ theme }) => theme.palette.background.default};
  padding: 1rem;
  margin-top: 1rem;
`;

const StyledProjectContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  column-gap: 1rem;
  align-items: center;
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
  const [fetchedProject, isLoadingProject] = useFetch<CristinProject>(project.id, true); // TODO: remove auth
  const institutionName = fetchedProject && getAffiliationLabel(fetchedProject.coordinatingInstitution.name); // TODO: rename function
  const projectManager = fetchedProject?.contributors.find((contributor) => contributor.type === 'ProjectManager');
  const projectManagerName = [projectManager?.identity.firstName, projectManager?.identity.lastName].join(' ');

  const startDate = fetchedProject?.startDate && new Date(fetchedProject.startDate);
  const endDate = fetchedProject?.endDate && new Date(fetchedProject.endDate);
  const dateInterval = [
    startDate && !isNaN(startDate.valueOf()) ? startDate.toLocaleDateString() : '?',
    endDate && !isNaN(endDate.valueOf()) ? endDate.toLocaleDateString() : '?',
  ].join(' - ');

  return (
    <StyledProjectRow>
      {isLoadingProject ? (
        <StyledProjectContent>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </StyledProjectContent>
      ) : fetchedProject ? (
        <StyledProjectContent>
          <Typography variant="subtitle2">{fetchedProject.title}</Typography>
          <Typography variant="body1">{institutionName}</Typography>
          <Typography variant="body1">{projectManagerName}</Typography>
          <div>
            <Typography variant="body1">{dateInterval}</Typography>
            <Typography variant="body1">
              {t('public_page.participants', { count: fetchedProject.contributors.length })}
            </Typography>
          </div>
        </StyledProjectContent>
      ) : null}
    </StyledProjectRow>
  );
};
