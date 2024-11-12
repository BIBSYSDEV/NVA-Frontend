import { Divider, Link, Skeleton, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { fetchProject } from '../../api/cristinApi';
import { ResearchProject } from '../../types/project.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getProjectPath } from '../../utils/urlPaths';
import {
  getProjectCoordinatingInstitutionName,
  getProjectManagerName,
  getProjectPeriod,
} from '../registration/description_tab/projects_field/projectHelpers';

const StyledProjectGridRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '2fr auto 1fr auto 1fr auto 1fr',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
  columnGap: '1rem',
  alignItems: 'center',
}));

interface PublicProjectsContentProps {
  projects: ResearchProject[];
}

export const PublicProjectsContent = ({ projects }: PublicProjectsContentProps) => {
  const { t } = useTranslation();

  return (
    <>
      <StyledProjectGridRow
        sx={{
          display: { xs: 'none', md: 'grid' },
        }}>
        <Typography variant="caption">{t('common.title')}</Typography>
        <span />
        <Typography variant="caption">{t('project.coordinating_institution')}</Typography>
        <span />
        <Typography variant="caption">{t('project.project_manager')}</Typography>
        <span />
        <Typography variant="caption">{t('project.project_info')}</Typography>
      </StyledProjectGridRow>

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
  const { t } = useTranslation();

  const projectQuery = useQuery({
    enabled: !!project.id,
    queryKey: ['project', project.id],
    queryFn: () => fetchProject(project.id),
    meta: { errorMessage: t('feedback.error.get_project') },
  });
  const fetchedProject = projectQuery.data;
  const projectTitle = fetchedProject?.title ?? project.name;

  return (
    <StyledProjectGridRow sx={{ ':not(:last-of-type)': { mb: '1rem' } }}>
      {projectQuery.isPending ? (
        <Skeleton />
      ) : (
        <Typography
          variant="body1"
          variantMapping={{ body1: 'h3' }}
          data-testid={dataTestId.registrationLandingPage.projectTitle}
          sx={{ fontWeight: 500 }}>
          {fetchedProject?.id ? (
            <Link component={RouterLink} to={getProjectPath(fetchedProject.id)}>
              {projectTitle}
            </Link>
          ) : (
            projectTitle
          )}
        </Typography>
      )}
      <Divider component="span" orientation="vertical" />
      {projectQuery.isPending ? (
        <Skeleton />
      ) : (
        <Typography variant="body1">{getProjectCoordinatingInstitutionName(fetchedProject)}</Typography>
      )}
      <Divider component="span" orientation="vertical" />
      {projectQuery.isPending ? (
        <Skeleton />
      ) : (
        <Typography variant="body1">{getProjectManagerName(fetchedProject)}</Typography>
      )}
      <Divider component="span" orientation="vertical" />
      {projectQuery.isPending ? (
        <Skeleton />
      ) : fetchedProject ? (
        <div>
          <Typography variant="body1">{getProjectPeriod(fetchedProject)}</Typography>
          <Typography variant="body1">
            {t('registration.public_page.participants', { count: fetchedProject?.contributors.length })}
          </Typography>
        </div>
      ) : null}
    </StyledProjectGridRow>
  );
};
