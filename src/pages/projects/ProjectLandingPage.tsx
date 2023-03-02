import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import { CristinProject } from '../../types/project.types';
import { dataTestId } from '../../utils/dataTestIds';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { ProjectContributors } from './ProjectContributors';
import { ProjectGeneralInfo } from './ProjectGeneralInfo';
import { ProjectSummary } from './ProjectSummary';
import { ProjectResultsAccordion } from './ProjectResultsAccordion';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { StyledPaperHeader } from '../../components/PageWithSideMenu';
import { TruncatableTypography } from '../../components/TruncatableTypography';
import { RootState } from '../../redux/store';
import { canEditProject } from '../registration/description_tab/projects_field/projectHelpers';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { ProjectFormDialog } from './form/ProjectFormDialog';
import { PublicProjectsContent } from '../public_registration/PublicProjectsContent';

interface ProjectLandingPageProps {
  project: CristinProject;
  refetchProject: () => void;
}

export const ProjectLandingPage = ({ project, refetchProject }: ProjectLandingPageProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const userCanEditProject = canEditProject(user, project);
  const [openEditProject, setOpenEditProject] = useState(false);

  return (
    <Paper elevation={0}>
      <Helmet>
        <title>{project.title}</title>
      </Helmet>
      <StyledPaperHeader>
        <Typography sx={{ color: 'inherit' }}>{t('project.project')}</Typography>

        <TruncatableTypography variant="h1" sx={{ color: 'inherit' }}>
          {project.title}
        </TruncatableTypography>
        {userCanEditProject && (
          <BetaFunctionality>
            <Tooltip title={t('project.edit_project')}>
              <IconButton
                data-testid={dataTestId.projectLandingPage.editProjectButton}
                onClick={() => setOpenEditProject(true)}
                sx={{ ml: 'auto', color: 'inherit' }}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <ProjectFormDialog
              open={openEditProject}
              currentProject={project}
              onClose={() => setOpenEditProject(false)}
              refetchData={refetchProject}
            />
          </BetaFunctionality>
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
          heading={`${t('project.project_participants')} (${project.contributors.length})`}>
          <ProjectContributors contributors={project.contributors} />
        </LandingPageAccordion>

        <ProjectResultsAccordion projectId={project.id} />

        <LandingPageAccordion
          dataTestId={dataTestId.projectLandingPage.relatedProjectsAccordion}
          heading={`${t('project.form.related_projects')} (${project.relatedProjects.length})`}>
          <PublicProjectsContent projects={project.relatedProjects.map((projectId) => ({ id: projectId }))} />
        </LandingPageAccordion>
      </BackgroundDiv>
    </Paper>
  );
};
