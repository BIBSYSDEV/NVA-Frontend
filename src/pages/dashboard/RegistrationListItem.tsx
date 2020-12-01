import React, { FC, Fragment } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Link as MuiLink, Typography, ListItem, ListItemText } from '@material-ui/core';
import CalendarIcon from '@material-ui/icons/Today';
import TagIcon from '@material-ui/icons/LocalOffer';
import { useTranslation } from 'react-i18next';
import Truncate from 'react-truncate';
import { SearchRegistration } from '../../types/search.types';
import { displayDate } from '../../utils/date-helpers';

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
  const registrationId = registration.id.split('/').pop();

  const focusedContributors = [...registration.contributors].splice(0, 5);
  const countRestContributors = registration.contributors.length - focusedContributors.length;

  return (
    <ListItem divider>
      <ListItemText disableTypography data-testid="result-list-item">
        <Typography variant="h4">
          <MuiLink component={Link} to={`/registration/${registrationId}/public`}>
            {registration.title}
          </MuiLink>
        </Typography>
        <StyledContributors>
          {focusedContributors.map((contributor, index) => (
            <Typography key={index}>
              {contributor.id ? (
                <MuiLink component={Link} to={`/user?id=${encodeURIComponent(contributor.id)}`}>
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
          <Truncate lines={3} ellipsis="[...]">
            {registration.abstract}
          </Truncate>
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
