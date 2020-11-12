import React, { FC, Fragment } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Link as MuiLink, Typography, ListItem, ListItemText } from '@material-ui/core';
import CalendarIcon from '@material-ui/icons/Today';
import TagIcon from '@material-ui/icons/LocalOffer';
import { SearchRegistration } from '../../types/search.types';
import { displayDate } from '../../utils/date-helpers';
import { useTranslation } from 'react-i18next';
import Truncate from 'react-truncate';

const StyledContributors = styled.div`
  display: flex;
  > :not(:last-child) {
    margin-right: 1rem;
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
      <ListItemText
        disableTypography
        data-testid="result-list-item"
        primary={
          <Typography variant="h4">
            <MuiLink component={Link} to={`/registration/${registrationId}/public`}>
              {registration.title}
            </MuiLink>
          </Typography>
        }
        secondary={
          <>
            <StyledContributors>
              {focusedContributors.map((contributor) => (
                <Fragment key={contributor.id ?? contributor.name}>
                  {contributor.id ? (
                    <MuiLink component={Link} to={`/user/${contributor.id}`}>
                      <Typography>{contributor.name}</Typography>
                    </MuiLink>
                  ) : (
                    <Typography>{contributor.name}</Typography>
                  )}
                </Fragment>
              ))}
              {/* TODO: i18n */}
              {countRestContributors > 0 && <Typography>(+ {countRestContributors} andre)</Typography>}
            </StyledContributors>

            <Typography>
              <Truncate lines={3} ellipsis="[...]">
                {registration.abstract}
              </Truncate>
            </Typography>
            <StyledMetadata>
              {registration.publishedDate && (
                <>
                  <CalendarIcon />
                  <Typography variant="body2">{displayDate(registration.publishedDate)}</Typography>
                </>
              )}
              <>
                <TagIcon />
                <Typography variant="body2">{t(registration.publicationType)}</Typography>
              </>
            </StyledMetadata>
          </>
        }
      />
    </ListItem>
  );
};

export default RegistrationListItem;
