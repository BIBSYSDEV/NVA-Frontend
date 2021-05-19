import deepmerge from 'deepmerge';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BackgroundDiv from '../../components/BackgroundDiv';
import { RegistrationPageHeader } from '../../components/PageHeader';
import lightTheme from '../../themes/lightTheme';
import { emptyRegistration, Registration } from '../../types/registration.types';
import { PublicFilesContent } from './PublicFilesContent';
import PublicGeneralContent from './PublicGeneralContent';
import { PublicProjectsContent } from './PublicProjectsContent';
import { PublicRegistrationContributors } from './PublicRegistrationContributors';
import { PublicRegistrationStatusBar } from './PublicRegistrationStatusBar';
import { PublicSummaryContent } from './PublicSummaryContent';

const StyledBackgroundDiv = styled(BackgroundDiv)`
  padding: 2rem 5rem;
  max-width: 100vw;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.md}px`}) {
    padding: 1rem 2rem;
  }
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
      <RegistrationPageHeader
        details={{
          publicationType: t(`publicationTypes:${reference.publicationInstance.type}`),
          publicationYear: date.year,
        }}>
        {mainTitle || `[${t('common:missing_title')}]`}
      </RegistrationPageHeader>
      <div>
        {contributors && (
          <PublicRegistrationContributors
            contributors={contributors}
            registrationType={reference.publicationInstance.type}
          />
        )}

        <StyledBackgroundDiv backgroundColor={lightTheme.palette.section.megaLight}>
          <PublicGeneralContent registration={registration} />
        </StyledBackgroundDiv>

        {fileSet.files.length > 0 && (
          <StyledBackgroundDiv backgroundColor={lightTheme.palette.section.light}>
            <PublicFilesContent registration={registration} />
          </StyledBackgroundDiv>
        )}

        {(abstract || description || tags.length > 0) && (
          <StyledBackgroundDiv backgroundColor={lightTheme.palette.section.main}>
            <PublicSummaryContent registration={registration} />
          </StyledBackgroundDiv>
        )}

        {projects?.length > 0 && (
          <StyledBackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
            <PublicProjectsContent projects={projects} />
          </StyledBackgroundDiv>
        )}
      </div>
    </>
  );
};
