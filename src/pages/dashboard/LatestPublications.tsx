import React, { FC } from 'react';
import styled from 'styled-components';

import { List, ListItemText, Typography, ListItemAvatar, Avatar, Divider, CircularProgress } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';

import { PublicationListItem } from '../../types/publication.types';
import Heading from '../../components/Heading';
import { useTranslation } from 'react-i18next';
import useFetchLatestPublications from '../../utils/hooks/useFetchLatestPublications';
import { StyledProgressWrapper } from '../../components/styled/Wrappers';
import NormalText from '../../components/NormalText';

const StyledListContainer = styled.div`
  padding-bottom: 1rem;
`;

const StyledListItem = styled.li`
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
`;

const StyledNormalText = styled(NormalText)`
  padding-top: 1rem;
`;

const LatestPublications: FC = () => {
  const { t } = useTranslation('publication');
  const [publications, isLoadingPublications] = useFetchLatestPublications();

  return (
    <StyledListContainer data-testid="newest-publications">
      <Heading>{t('publication.newest_publications')}</Heading>
      <Divider />
      {isLoadingPublications ? (
        <StyledProgressWrapper>
          <CircularProgress />
        </StyledProgressWrapper>
      ) : publications.length > 0 ? (
        <>
          <List>
            {publications.map((publication: PublicationListItem) => (
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
        </>
      ) : (
        <StyledNormalText>{t('publication.no_published_publications_yet')}</StyledNormalText>
      )}
    </StyledListContainer>
  );
};

export default LatestPublications;
