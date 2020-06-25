import React, { FC } from 'react';
import styled from 'styled-components';

import { List, ListItemText, Typography, ListItemAvatar, Avatar, Divider } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';

import { PublicationListItem } from '../../types/publication.types';
import Heading from '../../components/Heading';
import { useTranslation } from 'react-i18next';

interface LatestPublicationsProps {
  publications: PublicationListItem[];
}

const StyledListContainer = styled.div`
  padding-bottom: 1rem;
`;

const StyledListItem = styled.li`
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
`;

const LatestPublications: FC<LatestPublicationsProps> = ({ publications }) => {
  const { t } = useTranslation('publication');

  return (
    <StyledListContainer data-testid="search-results">
      <Heading>{t('publication.newest_publications')}</Heading>
      <Divider />
      <List>
        {publications &&
          publications.map((publication) => (
            <StyledListItem key={publication.identifier}>
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                data-testid="result-list-item"
                primary={
                  <MuiLink component={Link} to={`/publication/${publication.identifier}/public`}>
                    {publication.mainTitle}
                  </MuiLink>
                }
                secondary={
                  <Typography component="span">
                    {new Date(publication.modifiedDate).toLocaleDateString()} - {publication.owner}
                  </Typography>
                }
              />
            </StyledListItem>
          ))}
      </List>
      <Divider />
    </StyledListContainer>
  );
};

export default LatestPublications;
