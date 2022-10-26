import { useTranslation } from 'react-i18next';
import { ItalicPageHeader } from '../../components/PageHeader';
import { CristinProject } from '../../types/project.types';
import { dataTestId } from '../../utils/dataTestIds';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { ProjectContributors } from './ProjectContributors';
import { ProjectGeneralInfo } from './ProjectGeneralInfo';
import { ProjectSummary } from './ProjectSummary';
import { ProjectResultsAccordion } from './ProjectResultsAccordion';
import { BackgroundDiv } from '../../components/styled/Wrappers';

interface ProjectLandingPageProps {
  project: CristinProject;
}

export const ProjectLandingPage = ({ project }: ProjectLandingPageProps) => {
  const { t } = useTranslation();

  return (
    <BackgroundDiv>
      <ItalicPageHeader superHeader={`${t('project.project')} - ${t(`project.status.${project.status}`)}`}>
        {project.title}
      </ItalicPageHeader>

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
    </BackgroundDiv>
  );
};
