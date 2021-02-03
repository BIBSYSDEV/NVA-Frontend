import React from 'react';
import { Chip, MuiThemeProvider, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../types/registration.types';
import lightTheme from '../../themes/lightTheme';

const StyledSummaryContent = styled.div`
  display: grid;
  grid-template-areas: 'abstract tags';
  grid-template-columns: 4fr 1fr;
  grid-column-gap: 2rem;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.sm}px`}) {
    grid-template-areas: 'abstract' 'tags';
    grid-template-columns: 1fr;
    grid-row-gap: 1rem;
  }
`;

const AbstractDiv = styled.div`
  grid-area: abstract;
`;

const TagsDiv = styled.div`
  grid-area: tags;
`;

const StyledTagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  > div {
    margin-bottom: 0.5rem;
    :not(:last-child) {
      margin-right: 0.5rem;
    }
  }
`;

const StyledChip = styled(Chip)`
  background: ${({ theme }) => theme.palette.section.light};
`;

export interface PublicRegistrationContentProps {
  registration: Registration;
}

const PublicSummaryContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation('registration');

  const { abstract, tags } = registration.entityDescription;

  return (
    <StyledSummaryContent>
      <AbstractDiv>
        <Typography variant="h4" component="h2" gutterBottom>
          {t('description.abstract')}
        </Typography>
        <Typography>{abstract}</Typography>
      </AbstractDiv>
      <TagsDiv>
        <Typography variant="h4" component="h2" gutterBottom>
          {t('description.keywords')}
        </Typography>
        <StyledTagsList>
          <MuiThemeProvider theme={lightTheme}>
            {tags.map((tag) => (
              <StyledChip key={tag} label={tag} />
            ))}
          </MuiThemeProvider>
        </StyledTagsList>
      </TagsDiv>
    </StyledSummaryContent>
  );
};

export default PublicSummaryContent;
