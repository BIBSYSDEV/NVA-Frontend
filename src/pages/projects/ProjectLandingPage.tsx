import { Accordion, AccordionSummary, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
    grid-row-gap: 1rem;
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
  return (
    <>
      <PageHeader>{project.title}</PageHeader>

      <StyledGeneralInfoBox>
        <div>
          <Typography variant="overline" component="h2">
            Prosjekteier
          </Typography>
          <Typography>{getProjectName(project) ?? '-'}</Typography>
          <Typography variant="overline" component="h2">
            Prosjektleder
          </Typography>
          <Typography>{getProjectManagerName(project) ?? '-'}</Typography>
          <Typography variant="overline" component="h2">
            Prosjektperiode
          </Typography>
          <Typography>{getProjectPeriod(project) ?? '-'}</Typography>
        </div>
        <div>
          <Typography variant="overline" component="h2">
            Kategori og disiplin
          </Typography>
          <Typography>-</Typography>
          <Typography variant="overline" component="h2">
            Finansiering
          </Typography>
          <Typography>-</Typography>
        </div>
      </StyledGeneralInfoBox>

      <StyledAccordion square elevation={0}>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
          <Typography variant="h3" color="primary">
            Vitenskapelig sammendrag
          </Typography>
        </StyledAccordionSummary>
      </StyledAccordion>

      <StyledAccordion square elevation={0}>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
          <Typography variant="h3" color="primary">
            Prosjektdeltakere
          </Typography>
        </StyledAccordionSummary>
      </StyledAccordion>

      <StyledAccordion square elevation={0}>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
          <Typography variant="h3" color="primary">
            Resultater
          </Typography>
        </StyledAccordionSummary>
      </StyledAccordion>
    </>
  );
};
