import deepmerge from 'deepmerge';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { ItalicPageHeader } from '../../components/PageHeader';
import { emptyRegistration, Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { PublicFilesContent } from './PublicFilesContent';
import { PublicGeneralContent } from './PublicGeneralContent';
import { PublicProjectsContent } from './PublicProjectsContent';
import { PublicRegistrationContributors } from './PublicRegistrationContributors';
import { PublicRegistrationStatusBar } from './PublicRegistrationStatusBar';
import { PublicSummaryContent } from './PublicSummaryContent';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { ShareOptions } from './ShareOptions';

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
        superHeader={{
          title: reference.publicationInstance.type ? (
            <>
              <span data-testid={dataTestId.registrationLandingPage.registrationSubtype}>
                {t(`publicationTypes:${reference.publicationInstance.type}`)}
              </span>
              <StyledYearSpan data-testid={dataTestId.registrationLandingPage.publicationDate}>
                {date.year}
              </StyledYearSpan>
            </>
          ) : null,
          icon: <MenuBookIcon />,
        }}
        data-testid={dataTestId.registrationLandingPage.title}>
        {mainTitle || `[${t('common:missing_title')}]`}
      </ItalicPageHeader>
      <div>
        {contributors.length > 0 && (
          <PublicRegistrationContributors
            contributors={contributors}
            registrationType={reference.publicationInstance.type}
          />
        )}

        <ShareOptions title={mainTitle} description={abstract ?? description ?? ''} />

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
