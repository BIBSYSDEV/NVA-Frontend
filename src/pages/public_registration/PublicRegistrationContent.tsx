import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import deepmerge from 'deepmerge';
import { emptyRegistration, Registration } from '../../types/registration.types';
import { PublicRegistrationStatusBar } from './PublicRegistrationStatusBar';
import { RegistrationPageHeader } from '../../components/PageHeader';
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';
import PublicGeneralContent from './PublicGeneralContent';
import { PublicRegistrationContributors } from './PublicRegistrationContributors';
import { PublicSummaryContent } from './PublicSummaryContent';
import { PublicProjectsContent } from './PublicProjectsContent';
import { PublicFilesContent } from './PublicFilesContent';

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
    entityDescription: { contributors, mainTitle, abstract, description, tags, reference },
    projects,
    fileSet,
  } = registration;

  return (
    <>
      <PublicRegistrationStatusBar registration={registration} refetchRegistration={refetchRegistration} />
      <RegistrationPageHeader>{mainTitle || `[${t('common:missing_title')}]`}</RegistrationPageHeader>
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
