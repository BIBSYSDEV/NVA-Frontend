import React from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Link, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import styled from 'styled-components';
import { CristinProject, ResearchProject } from '../../types/project.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { getProjectPath } from '../../utils/urlPaths';
import {
  getProjectManagerName,
  getProjectName,
  getProjectPeriod,
} from '../registration/description_tab/projects_field/projectHelpers';
import { dataTestId } from '../../utils/dataTestIds';

const StyledProjectGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr auto 1fr auto 1fr auto 1fr;
  column-gap: 1rem;
  align-items: center;
`;

const StyledHeadingRow = styled(StyledProjectGrid)`
  padding: 0 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display: none;
  }
`;

const StyledProjectRow = styled(StyledProjectGrid)`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.palette.section.megaLight};
  margin-bottom: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-columns: 1fr;
  }
`;

const StyledProjectTitle = styled(Typography)`
  font-weight: 500;
`;

interface PublicProjectsContentProps {
  projects: ResearchProject[];
}

export const PublicProjectsContent = ({ projects }: PublicProjectsContentProps) => {
  const { t } = useTranslation('project');

  return (
    <>
      <StyledHeadingRow>
        <Typography variant="caption">{t('common:title')}</Typography>
        <span />
        <Typography variant="caption">{t('common:institution')}</Typography>
        <span />
        <Typography variant="caption">{t('project_manager')}</Typography>
        <span />
        <Typography variant="caption">{t('project_info')}</Typography>
      </StyledHeadingRow>

      {projects.map((project) => (
        <ProjectRow key={project.id} project={project} />
      ))}
    </>
  );
};

interface ProjectRowProps {
  project: ResearchProject;
}

const ProjectRow = ({ project }: ProjectRowProps) => {
  const { t } = useTranslation('registration');
  const [fetchedProject, isLoadingProject] = useFetch<CristinProject>({ url: project.id });
  const projectTitle = fetchedProject?.title ?? project.name;

  return (
    <StyledProjectRow>
      {isLoadingProject ? (
        <Skeleton />
      ) : (
        <StyledProjectTitle
          variant="body1"
          variantMapping={{ body1: 'h3' }}
          data-testid={dataTestId.registrationLandingPage.projectTitle}>
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
