import deepmerge from 'deepmerge';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ItalicPageHeader } from '../../components/PageHeader';
import { emptyRegistration, Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { PublicFilesContent } from './PublicFilesContent';
import PublicGeneralContent from './PublicGeneralContent';
import { PublicProjectsContent } from './PublicProjectsContent';
import { PublicRegistrationContributors } from './PublicRegistrationContributors';
import { PublicRegistrationStatusBar } from './PublicRegistrationStatusBar';
import { PublicSummaryContent } from './PublicSummaryContent';
import { LandingPageAccordion } from '../../components/LandingPageAccordion';

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
          <LandingPageAccordion
            data-testid={dataTestId.registrationLandingPage.filesAccordion}
            defaultExpanded
            heading={t('files_and_license.files')}>
            <PublicFilesContent registration={registration} />
          </LandingPageAccordion>
        )}

        {(abstract || description || tags.length > 0) && (
          <LandingPageAccordion
            data-testid={dataTestId.registrationLandingPage.abstractAccordion}
            defaultExpanded
            heading={t('description.abstract')}>
            <PublicSummaryContent registration={registration} />
          </LandingPageAccordion>
        )}

        {projects?.length > 0 && (
          <LandingPageAccordion
            data-testid={dataTestId.registrationLandingPage.projectsAccordion}
            defaultExpanded
            heading={t('description.project_association')}>
            <PublicProjectsContent projects={projects} />
          </LandingPageAccordion>
        )}
      </div>
    </>
  );
};
