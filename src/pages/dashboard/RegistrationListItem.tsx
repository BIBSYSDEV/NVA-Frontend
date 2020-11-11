import React, { FC, Fragment } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Link as MuiLink, Typography, ListItem, ListItemText } from '@material-ui/core';
import CalendarIcon from '@material-ui/icons/Today';
import TagIcon from '@material-ui/icons/LocalOffer';
import { SearchRegistration } from '../../types/search.types';
import { displayDate } from '../../utils/date-helpers';
import { useTranslation } from 'react-i18next';

const StyledContributor = styled.span`
  padding-right: 1rem;
`;

const StyledMetadata = styled.div`
  display: flex;
  align-items: center;
  > span:not(:last-child) {
    margin-right: 1rem;
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
            {registration.contributors &&
              registration.contributors.map((contributor) => (
                <Fragment key={contributor.id ?? contributor.name}>
                  {contributor.id ? (
                    <MuiLink component={Link} to={`/user/${contributor.id}`}>
                      <StyledContributor>{contributor.name}</StyledContributor>
                    </MuiLink>
                  ) : (
                    <StyledContributor>{contributor.name}</StyledContributor>
                  )}
                </Fragment>
              ))}
            <Typography>{registration.abstract}</Typography>
            <StyledMetadata>
              {registration.publishedDate && (
                <>
                  <CalendarIcon />
                  <span>{displayDate(registration.publishedDate)}</span>
                </>
              )}
              <>
                <TagIcon />
                <span>{t(registration.publicationType)}</span>
              </>
            </StyledMetadata>
          </>
        }
      />
    </ListItem>
  );
};

export default RegistrationListItem;
