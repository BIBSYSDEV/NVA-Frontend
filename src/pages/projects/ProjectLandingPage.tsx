import React from 'react';
import { Link, Typography } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useTranslation } from 'react-i18next';
import { ItalicPageHeader } from '../../components/PageHeader';
import { CristinProject, ProjectContributor } from '../../types/project.types';
import {
  getProjectName,
  getProjectManagerName,
  getProjectPeriod,
} from '../registration/description_tab/projects_field/projectHelpers';
import { dataTestId } from '../../utils/dataTestIds';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { StyledGeneralInfo } from '../../components/landing_page/SyledGeneralInfo';
import { getLanguageString } from '../../utils/translation-helpers';
import styled from 'styled-components';

const StyledContributorElement = styled.div`
  margin-bottom: 0.5rem;
`;

interface ProjectLandingPageProps {
  project: CristinProject;
}

export const ProjectLandingPage = ({ project }: ProjectLandingPageProps) => {
  const { t } = useTranslation('project');

  const projectManagers = project.contributors.filter((contributor) => contributor.type === 'ProjectManager');
  const projectParticipants = project.contributors.filter((contributor) => contributor.type === 'ProjectParticipant');

  const popularScienceSummary = getLanguageString(project.popularScientificSummary);
  const academicSummary = getLanguageString(project.academicSummary);
  return (
    <>
      <ItalicPageHeader
        superHeader={{ title: `${t('project')} - ${t(`status.${project.status}`)}`, icon: <AccountTreeIcon /> }}>
        {project.title}
      </ItalicPageHeader>

      <StyledGeneralInfo data-testid={dataTestId.projectLandingPage.generalInfoBox}>
        <div>
          <Typography variant="overline" component="h2">
            {t('project_owner')}
          </Typography>
          <Typography>{getProjectName(project) ?? '-'}</Typography>
          <Typography variant="overline" component="h2">
            {t('project_manager')}
          </Typography>
          <Typography>{getProjectManagerName(project) ?? '-'}</Typography>
          <Typography variant="overline" component="h2">
            {t('period')}
          </Typography>
          <Typography>{getProjectPeriod(project) ?? '-'}</Typography>
        </div>
        <div>
          <Typography variant="overline" component="h2">
            {t('financing')}
          </Typography>
          {project.funding.length > 0 ? (
            project.funding.map((funding) => {
              const text = `${getLanguageString(funding.source.names)} - ${t('grant_id')} ${funding.code}`;
              return (
                <Typography key={funding.code}>
                  {funding.source.code === 'NFR' ? (
                    <Link
                      href={`https://prosjektbanken.forskningsradet.no/project/FORISS/${funding.code}`}
                      target="_blank">
                      {text}
                    </Link>
                  ) : (
                    text
                  )}
                </Typography>
              );
            })
          ) : (
            <Typography>-</Typography>
          )}
        </div>
      </StyledGeneralInfo>

      <LandingPageAccordion
        heading={t('summary')}
        data-testid={dataTestId.projectLandingPage.scientificSummaryAccordion}>
        {academicSummary && (
          <>
            <Typography variant="h3">{t('scientific_summary')}</Typography>
            <Typography paragraph>{academicSummary}</Typography>
          </>
        )}
        {popularScienceSummary && (
          <>
            <Typography variant="h3">{t('popular_science_summary')}</Typography>
            <Typography>{popularScienceSummary}</Typography>
          </>
        )}
      </LandingPageAccordion>

      <LandingPageAccordion
        data-testid={dataTestId.projectLandingPage.participantsAccordion}
        heading={t('project_participants')}>
        {projectManagers.length > 0 && (
          <>
            <Typography variant="overline" component="h3">
              {t('project_manager')}
            </Typography>
            {projectManagers.map((manager) => (
              <ContributorElement key={manager.identity.id} contributor={manager} />
            ))}
          </>
        )}
        {projectParticipants.length > 0 && (
          <>
            <Typography variant="overline" component="h3">
              {t('project_participants')}
            </Typography>
            {projectParticipants.map((participant) => (
              <ContributorElement key={participant.identity.id} contributor={participant} />
            ))}
          </>
        )}
      </LandingPageAccordion>

      <LandingPageAccordion
        data-testid={dataTestId.projectLandingPage.resultsAccordion}
        heading={t('results')}></LandingPageAccordion>
    </>
  );
};

interface ContributorElementProps {
  contributor: ProjectContributor;
}

const ContributorElement = ({ contributor }: ContributorElementProps) => {
  return (
    <StyledContributorElement>
      <Typography variant="subtitle2" component="p">
        {contributor.identity.firstName} {contributor.identity.lastName}
      </Typography>
      <Typography variant="body2">{getLanguageString(contributor.affiliation.name)}</Typography>
    </StyledContributorElement>
  );
};
