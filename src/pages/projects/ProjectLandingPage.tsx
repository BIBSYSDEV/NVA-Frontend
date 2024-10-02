import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Paper, Tooltip } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { StyledPaperHeader } from '../../components/PageWithSideMenu';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { TruncatableTypography } from '../../components/TruncatableTypography';
import { RootState } from '../../redux/store';
import { CristinProject } from '../../types/project.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getEditProjectPath } from '../../utils/urlPaths';
import { ProjectIconHeader } from '../project/components/ProjectIconHeader';
import { canEditProject } from '../registration/description_tab/projects_field/projectHelpers';
import { ProjectContributors } from './ProjectContributors';
import { ProjectGeneralInfo } from './ProjectGeneralInfo';
import { ProjectResultsAccordion } from './ProjectResultsAccordion';
import { ProjectSummary } from './ProjectSummary';
import { RelatedProjects } from './RelatedProjects';

interface ProjectLandingPageProps {
  project: CristinProject;
  refetchProject: () => void;
}

export const ProjectLandingPage = ({ project }: ProjectLandingPageProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const userCanEditProject = canEditProject(user, project);

  return (
    <Paper elevation={0}>
      <Helmet>
        <title>{project.title}</title>
      </Helmet>
      <StyledPaperHeader sx={{ borderLeft: '1.5rem solid', borderColor: 'project.main' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <ProjectIconHeader projectStatus={project.status} />
          <TruncatableTypography variant="h1" sx={{ color: 'inherit' }}>
            {project.title}
          </TruncatableTypography>
        </Box>
        {userCanEditProject && (
          <Tooltip title={t('project.edit_project')}>
            <IconButton
              data-testid={dataTestId.projectLandingPage.editProjectButton}
              component={RouterLink}
              to={getEditProjectPath(project.id)}
              sx={{ ml: 'auto', color: 'inherit' }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
      </StyledPaperHeader>
      <BackgroundDiv>
        <ProjectGeneralInfo project={project} />

        <LandingPageAccordion
          heading={t('project.summary')}
          dataTestId={dataTestId.projectLandingPage.scientificSummaryAccordion}>
          <ProjectSummary
            academicSummary={project.academicSummary}
            popularScienceSummary={project.popularScientificSummary}
          />
        </LandingPageAccordion>

        <LandingPageAccordion
          dataTestId={dataTestId.projectLandingPage.participantsAccordion}
          heading={`${t('project.heading.members')} (${project.contributors.length})`}>
          <ProjectContributors contributors={project.contributors} />
        </LandingPageAccordion>

        <ProjectResultsAccordion projectId={project.id} />

        <LandingPageAccordion
          dataTestId={dataTestId.projectLandingPage.relatedProjectsAccordion}
          heading={`${t('project.form.related_projects')} (${project.relatedProjects.length})`}>
          <RelatedProjects projectIds={project.relatedProjects} />
        </LandingPageAccordion>
      </BackgroundDiv>
    </Paper>
  );
};
