import React from 'react';
import styled from 'styled-components';
import { Accordion, AccordionSummary, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { CristinProject } from '../../types/project.types';
import {
  getProjectName,
  getProjectManagerName,
  getProjectPeriod,
} from '../registration/description_tab/projects_field/projectHelpers';

const StyledGeneralInfoBox = styled.div`
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1rem;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.sm}px`}) {
    grid-template-columns: 1fr;
  }
`;

const StyledAccordion = styled(Accordion)`
  border-top: 3px solid;
  background: ${({ theme }) => theme.palette.background.default};

  :last-child {
    border-bottom: 3px solid;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  padding: 1rem 0 1rem 0;
`;

interface ProjectLandingPageProps {
  project: CristinProject;
}

export const ProjectLandingPage = ({ project }: ProjectLandingPageProps) => {
  const { t } = useTranslation('project');

  return (
    <>
      <PageHeader>{project.title}</PageHeader>

      <StyledGeneralInfoBox>
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

      <StyledAccordion square elevation={0}>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
          <Typography variant="h3" component="h2" color="primary">
            {t('scientific_summary')}
          </Typography>
        </StyledAccordionSummary>
      </StyledAccordion>

      <StyledAccordion square elevation={0}>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
          <Typography variant="h3" component="h2" color="primary">
            {t('project_participants')}
          </Typography>
        </StyledAccordionSummary>
      </StyledAccordion>

      <StyledAccordion square elevation={0}>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
          <Typography variant="h3" component="h2" color="primary">
            {t('results')}
          </Typography>
        </StyledAccordionSummary>
      </StyledAccordion>
    </>
  );
};
