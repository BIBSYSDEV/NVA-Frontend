import React from 'react';
import { Typography } from '@mui/material';
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
            {t('category_and_discipline')}
          </Typography>
          <Typography>-</Typography>
          <Typography variant="overline" component="h2">
            {t('financing')}
          </Typography>
          <Typography>-</Typography>
        </div>
      </StyledGeneralInfo>

      <LandingPageAccordion
        heading={t('scientific_summary')}
        data-testid={dataTestId.projectLandingPage.scientificSummaryAccordion}></LandingPageAccordion>

      <LandingPageAccordion
        data-testid={dataTestId.projectLandingPage.participantsAccordion}
        heading={t('project_participants')}></LandingPageAccordion>

      <LandingPageAccordion
        data-testid={dataTestId.projectLandingPage.resultsAccordion}
        heading={t('results')}></LandingPageAccordion>
    </>
  );
};
