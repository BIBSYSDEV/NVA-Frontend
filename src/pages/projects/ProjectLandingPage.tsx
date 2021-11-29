import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useTranslation } from 'react-i18next';
import { ItalicPageHeader } from '../../components/PageHeader';
import { CristinProject } from '../../types/project.types';
import { dataTestId } from '../../utils/dataTestIds';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { ProjectContributors } from './ProjectContributors';
import { ProjectGeneralInfo } from './ProjectGeneralInfo';
import { ProjectSummary } from './ProjectSummary';
import { ProjectResultsAccordion } from './ProjectResultsAccordion';

interface ProjectLandingPageProps {
  project: CristinProject;
}

export const ProjectLandingPage = ({ project }: ProjectLandingPageProps) => {
  const { t } = useTranslation('project');

  return (
    <>
      <ItalicPageHeader
        superHeader={{ title: `${t('project')} - ${t(`status.${project.status}`)}`, icon: <AccountTreeIcon /> }}>
        {project.title}
      </ItalicPageHeader>

      <ProjectGeneralInfo project={project} />

      <LandingPageAccordion
        heading={t('summary')}
        data-testid={dataTestId.projectLandingPage.scientificSummaryAccordion}>
        <ProjectSummary
          academicSummary={project.academicSummary}
          popularScienceSummary={project.popularScientificSummary}
        />
      </LandingPageAccordion>

      <LandingPageAccordion
        data-testid={dataTestId.projectLandingPage.participantsAccordion}
        heading={`${t('project_participants')} (${project.contributors.length})`}>
        <ProjectContributors contributors={project.contributors} />
      </LandingPageAccordion>

      <ProjectResultsAccordion projectId={project.id} />
    </>
  );
};
