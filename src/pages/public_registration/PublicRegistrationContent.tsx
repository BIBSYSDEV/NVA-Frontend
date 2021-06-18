import { AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import deepmerge from 'deepmerge';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ItalicPageHeader } from '../../components/PageHeader';
import { emptyRegistration, Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { StyledAccordion } from '../projects/ProjectLandingPage';
import { PublicFilesContent } from './PublicFilesContent';
import PublicGeneralContent from './PublicGeneralContent';
import { PublicProjectsContent } from './PublicProjectsContent';
import { PublicRegistrationContributors } from './PublicRegistrationContributors';
import { PublicRegistrationStatusBar } from './PublicRegistrationStatusBar';
import { PublicSummaryContent } from './PublicSummaryContent';

const StyledYearSpan = styled.span`
  padding-left: 1rem;
`;

export interface PublicRegistrationContentProps {
  registration: Registration;
}
export interface PublicRegistrationProps extends PublicRegistrationContentProps {
  refetchRegistration: () => void;
}

export const PublicRegistrationContent = ({ registration, refetchRegistration }: PublicRegistrationProps) => {
  const { t } = useTranslation('registration');

  // Registration can lack some fields if it's newly created
  registration = deepmerge(emptyRegistration, registration);

  const {
    entityDescription: { contributors, date, mainTitle, abstract, description, tags, reference },
    projects,
    fileSet,
  } = registration;

  return (
    <>
      <PublicRegistrationStatusBar registration={registration} refetchRegistration={refetchRegistration} />
      <ItalicPageHeader
        superHeader={
          <>
            <span>{t(`publicationTypes:${reference.publicationInstance.type}`)}</span>
            <StyledYearSpan>{date.year}</StyledYearSpan>
          </>
        }>
        {mainTitle || `[${t('common:missing_title')}]`}
      </ItalicPageHeader>
      <div>
        {contributors && (
          <PublicRegistrationContributors
            contributors={contributors}
            registrationType={reference.publicationInstance.type}
          />
        )}

        <PublicGeneralContent registration={registration} />

        {fileSet.files.length > 0 && (
          <StyledAccordion square elevation={0} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
              <Typography variant="h3" component="h2" color="primary">
                {t('files_and_license.files')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PublicFilesContent registration={registration} />
            </AccordionDetails>
          </StyledAccordion>
        )}

        {(abstract || description || tags.length > 0) && (
          <StyledAccordion square elevation={0} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
              <Typography variant="h3" component="h2" color="primary">
                {t('description.abstract')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <PublicSummaryContent registration={registration} />
              </div>
            </AccordionDetails>
          </StyledAccordion>
        )}

        {projects?.length > 0 && (
          <StyledAccordion square elevation={0} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
              <Typography variant="h3" component="h2" color="primary">
                {t('description.project_association')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <PublicProjectsContent projects={projects} />
              </div>
            </AccordionDetails>
          </StyledAccordion>
        )}
      </div>
    </>
  );
};
