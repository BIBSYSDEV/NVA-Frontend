import React from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ItalicPageHeader } from '../../components/PageHeader';
import { CristinProject } from '../../types/project.types';
import {
  getProjectName,
  getProjectManagerName,
  getProjectPeriod,
} from '../registration/description_tab/projects_field/projectHelpers';
import { dataTestId } from '../../utils/dataTestIds';
import { LandingPageAccordion } from '../../components/LandingPageAccordion';

const StyledGeneralInfoBox = styled.div`
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1rem;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.sm}px`}) {
    grid-template-columns: 1fr;
  }
`;

interface ProjectLandingPageProps {
  project: CristinProject;
}

export const ProjectLandingPage = ({ project }: ProjectLandingPageProps) => {
  const { t } = useTranslation('project');

  return (
    <>
      <ItalicPageHeader superHeader={t('project')}>{project.title}</ItalicPageHeader>

      <StyledGeneralInfoBox data-testid={dataTestId.projectLandingPage.generalInfoBox}>
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
      </StyledGeneralInfoBox>

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
