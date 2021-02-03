import React from 'react';
import { Chip, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../types/registration.types';

const StyledSummaryContent = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  grid-column-gap: 1rem;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.md}px`}) {
    grid-template-columns: 1fr;
    grid-row-gap: 1rem;
  }
`;

export interface PublicRegistrationContentProps {
  registration: Registration;
}

const PublicSummaryContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation('registration');

  const { abstract, tags } = registration.entityDescription;

  return (
    <StyledSummaryContent>
      <div>
        {abstract && (
          <>
            <Typography variant="h4" component="h2" gutterBottom>
              {t('description.abstract')}
            </Typography>
            <Typography>{abstract}</Typography>
          </>
        )}
      </div>
      {tags.length > 0 && (
        <div>
          <Typography variant="h4" component="h2" gutterBottom>
            {t('description.keywords')}
          </Typography>
          {tags.map((tag) => (
            //   <StyledTag key={tag}>
            <Chip label={tag} />
            //   </StyledTag>
          ))}
        </div>
      )}
    </StyledSummaryContent>
  );
};

export default PublicSummaryContent;
