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
  padding: 1rem;
  background: white;

  :last-child {
    border-bottom: 3px solid;
  }
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
        <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
          <Typography variant="h3" color="primary">
            Vitenskapelig sammendrag
          </Typography>
        </AccordionSummary>
      </StyledAccordion>

      <StyledAccordion square elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
          <Typography variant="h3" color="primary">
            Prosjektdeltakere
          </Typography>
        </AccordionSummary>
      </StyledAccordion>

      <StyledAccordion square elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
          <Typography variant="h3" color="primary">
            Resultater
          </Typography>
        </AccordionSummary>
      </StyledAccordion>
    </>
  );
};
