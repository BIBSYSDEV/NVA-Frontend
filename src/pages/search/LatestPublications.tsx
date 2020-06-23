import React, { FC } from 'react';
import styled from 'styled-components';

import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';

import { PublicationPreview } from '../../types/publication.types';

interface LatestPublicationsProps {
  publications: PublicationPreview[];
}

const StyledSearchResults = styled.div`
  padding-bottom: 1rem;
`;

const LatestPublications: FC<LatestPublicationsProps> = ({ publications }) => {
  return (
    <StyledSearchResults data-testid="search-results">
      <List>
        {publications &&
          publications.map((publication) => (
            <ListItem key={publication.identifier}>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>

              <ListItemText
                data-testid="result-list-item"
                primary={
                  <MuiLink component={Link} to={`/publication/${publication.identifier}/public`}>
                    {publication.mainTitle}
                  </MuiLink>
                }
                secondary={
                  <Typography component="span">
                    {new Date(publication.createdDate).toLocaleDateString()} - {publication.owner}
                  </Typography>
                }
              />
            </ListItem>
          ))}
      </List>
    </StyledSearchResults>
  );
};

export default LatestPublications;
