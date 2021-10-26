import React from 'react';
import { Link, Typography } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useTranslation } from 'react-i18next';
import { ItalicPageHeader } from '../../components/PageHeader';
import { CristinProject } from '../../types/project.types';
import {
  getProjectName,
  getProjectManagerName,
  getProjectPeriod,
} from '../registration/description_tab/projects_field/projectHelpers';
import { dataTestId } from '../../utils/dataTestIds';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { StyledGeneralInfo } from '../../components/landing_page/SyledGeneralInfo';
import { getLanguageString } from '../../utils/translation-helpers';

interface ProjectLandingPageProps {
  project: CristinProject;
}

export const ProjectLandingPage = ({ project }: ProjectLandingPageProps) => {
  const { t } = useTranslation('project');

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
        heading={t('project_participants')}></LandingPageAccordion>

      <LandingPageAccordion
        data-testid={dataTestId.projectLandingPage.resultsAccordion}
        heading={t('results')}></LandingPageAccordion>
    </>
  );
};
