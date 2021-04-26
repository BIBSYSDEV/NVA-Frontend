import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import deepmerge from 'deepmerge';
import { emptyRegistration, Registration } from '../../types/registration.types';
import PublicRegistrationAuthors from './PublicRegistrationAuthors';
import PublicFilesContent from './PublicFilesContent';
import { PublicRegistrationStatusBar } from './PublicRegistrationStatusBar';
import { RegistrationPageHeader } from '../../components/PageHeader';
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';
import PublicProjectsContent from './PublicProjectsContent';
import PublicGeneralContent from './PublicGeneralContent';
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

const PublicRegistrationContent = ({ registration, refetchRegistration }: PublicRegistrationProps) => {
  const { t } = useTranslation('registration');

  // Registration can lack some fields if it's newly created
  registration = deepmerge(emptyRegistration, registration);

  const {
    entityDescription: { contributors, mainTitle, abstract, description, tags },
  } = registration;

  return (
    <>
      <PublicRegistrationStatusBar registration={registration} refetchRegistration={refetchRegistration} />
      <RegistrationPageHeader>{mainTitle || `[${t('common:missing_title')}]`}</RegistrationPageHeader>
      <div>
        {contributors && <PublicRegistrationAuthors contributors={contributors} />}

        <StyledBackgroundDiv backgroundColor={lightTheme.palette.section.megaLight}>
          <PublicGeneralContent registration={registration} />
        </StyledBackgroundDiv>

        <StyledBackgroundDiv backgroundColor={lightTheme.palette.section.light}>
          <PublicFilesContent registration={registration} />
        </StyledBackgroundDiv>

        {(abstract || description || tags.length > 0) && (
          <StyledBackgroundDiv backgroundColor={lightTheme.palette.section.main}>
            <PublicSummaryContent registration={registration} />
          </StyledBackgroundDiv>
        )}

        <StyledBackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
          <PublicProjectsContent registration={registration} />
        </StyledBackgroundDiv>
      </div>
    </>
  );
};

export default PublicRegistrationContent;
