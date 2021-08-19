import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';
import styled from 'styled-components';
import { Link as MuiLink, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { SearchRegistration } from '../types/search.types';
import { displayDate } from '../utils/date-helpers';
import { getRegistrationLandingPagePath, getUserPath } from '../utils/urlPaths';

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
  registrations: SearchRegistration[];
}

export const RegistrationList = ({ registrations }: RegistrationListProps) => (
  <List>
    {registrations.map((registration) => (
      <RegistrationListItem key={registration.id} registration={registration} />
    ))}
  </List>
);

interface RegistrationListItemProps {
  registration: SearchRegistration;
}

const RegistrationListItem = ({ registration }: RegistrationListItemProps) => {
  const { t } = useTranslation('publicationTypes');
  const { id, title, abstract, contributors, publicationType, publicationDate } = registration;

  const registrationId = id.split('/').pop() as string;
  const focusedContributors = contributors.slice(0, 5);
  const countRestContributors = contributors.length - focusedContributors.length;

  return (
    <ListItem divider disableGutters>
      <ListItemText disableTypography data-testid="result-list-item">
        <StyledSuperHeader variant="overline">
          {t(publicationType)} - {displayDate(publicationDate)}
        </StyledSuperHeader>
        <StyledRegistrationTitle gutterBottom>
          <MuiLink component={Link} to={getRegistrationLandingPagePath(registrationId)}>
            {title}
          </MuiLink>
        </StyledRegistrationTitle>
        <StyledContributors>
          {focusedContributors.map((contributor, index) => (
            <Typography key={index} variant="body2">
              {contributor.id ? (
                <MuiLink component={Link} to={getUserPath(contributor.id)}>
                  {contributor.name}
                </MuiLink>
              ) : (
                contributor.name
              )}
            </Typography>
          ))}
          {countRestContributors > 0 && (
            <Typography variant="body2">({t('common:x_others', { count: countRestContributors })})</Typography>
          )}
        </StyledContributors>

        <Typography>
          <TextTruncate line={3} element="span" truncateText=" [...]" text={abstract} />
        </Typography>
      </ListItemText>
    </ListItem>
  );
};
