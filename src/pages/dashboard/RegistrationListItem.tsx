import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';
import styled from 'styled-components';
import { Link as MuiLink, ListItem, ListItemText, Typography } from '@material-ui/core';
import TagIcon from '@material-ui/icons/LocalOffer';
import CalendarIcon from '@material-ui/icons/Today';
import { SearchRegistration } from '../../types/search.types';
import { displayDate } from '../../utils/date-helpers';
import { getRegistrationLandingPagePath, getUserPath } from '../../utils/urlPaths';

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

const StyledMetadata = styled.div`
  display: flex;
  align-items: center;
  > p:not(:last-child) {
    margin-right: 2rem;
  }
  > svg {
    margin-right: 0.2rem;
  }
`;

interface RegistrationListItemProps {
  registration: SearchRegistration;
}

const RegistrationListItem: FC<RegistrationListItemProps> = ({ registration }) => {
  const { t } = useTranslation('publicationTypes');
  const registrationId = registration.id.split('/').pop() as string;

  const focusedContributors = [...registration.contributors].splice(0, 5);
  const countRestContributors = registration.contributors.length - focusedContributors.length;

  return (
    <ListItem divider>
      <ListItemText disableTypography data-testid="result-list-item">
        <Typography variant="h4">
          <MuiLink component={Link} to={getRegistrationLandingPagePath(registrationId)}>
            {registration.title}
          </MuiLink>
        </Typography>
        <StyledContributors>
          {focusedContributors.map((contributor, index) => (
            <Typography key={index}>
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
            <Typography>({t('common:x_others', { count: countRestContributors })})</Typography>
          )}
        </StyledContributors>

        <Typography>
          <TextTruncate line={3} truncateText="[...]">
            {registration.abstract}
          </TextTruncate>
        </Typography>
        <StyledMetadata>
          {registration.publicationDate && (
            <>
              <CalendarIcon />
              <Typography variant="body2">{displayDate(registration.publicationDate)}</Typography>
            </>
          )}
          {registration.publicationType && (
            <>
              <TagIcon />
              <Typography variant="body2">{t(registration.publicationType)}</Typography>
            </>
          )}
        </StyledMetadata>
      </ListItemText>
    </ListItem>
  );
};

export default RegistrationListItem;
