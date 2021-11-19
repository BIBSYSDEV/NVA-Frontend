import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';
import styled from 'styled-components';
import { Link as MuiLink, List, ListItem, ListItemText, Typography } from '@mui/material';
import { displayDate } from '../utils/date-helpers';
import { getRegistrationLandingPagePath, getUserPath } from '../utils/urlPaths';
import { Registration } from '../types/registration.types';
import { ErrorBoundary } from './ErrorBoundary';

const StyledContributors = styled.div`
  display: flex;
  flex-wrap: wrap;
  > p {
    white-space: nowrap;
    :not(:last-child) {
      margin-right: 1rem;
    }
  }
`;

const StyledRegistrationTitle = styled(Typography)`
  font-size: 1rem;
  font-weight: 600;
  font-style: italic;
`;

const StyledSuperHeader = styled(Typography)`
  color: ${({ theme }) => theme.palette.section.megaDark};
`;

interface RegistrationListProps {
  registrations: Registration[];
}

export const RegistrationList = ({ registrations }: RegistrationListProps) => (
  <List>
    {registrations.map((registration) => (
      <ErrorBoundary key={registration.id}>
        <RegistrationListItem registration={registration} />
      </ErrorBoundary>
    ))}
  </List>
);

interface RegistrationListItemProps {
  registration: Registration;
}

const RegistrationListItem = ({ registration }: RegistrationListItemProps) => {
  const { t } = useTranslation('publicationTypes');
  const { identifier, entityDescription } = registration;

  const contributors = entityDescription?.contributors ?? [];
  const focusedContributors = contributors.slice(0, 5);
  const countRestContributors = contributors.length - focusedContributors.length;

  return (
    <ListItem divider disableGutters>
      <ListItemText disableTypography data-testid="result-list-item">
        <StyledSuperHeader variant="overline">
          {t(entityDescription?.reference?.publicationInstance.type ?? '')} - {displayDate(entityDescription?.date)}
        </StyledSuperHeader>
        <StyledRegistrationTitle gutterBottom>
          <MuiLink component={Link} to={getRegistrationLandingPagePath(identifier)}>
            {entityDescription?.mainTitle}
          </MuiLink>
        </StyledRegistrationTitle>
        <StyledContributors>
          {focusedContributors.map((contributor, index) => (
            <Typography key={index} variant="body2">
              {contributor.identity.id ? (
                <MuiLink component={Link} to={getUserPath(contributor.identity.id)}>
                  {contributor.identity.name}
                </MuiLink>
              ) : (
                contributor.identity.name
              )}
            </Typography>
          ))}
          {countRestContributors > 0 && (
            <Typography variant="body2">({t('common:x_others', { count: countRestContributors })})</Typography>
          )}
        </StyledContributors>

        <Typography>
          <TextTruncate line={3} element="span" truncateText=" [...]" text={entityDescription?.abstract} />
        </Typography>
      </ListItemText>
    </ListItem>
  );
};
