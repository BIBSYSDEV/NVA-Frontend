import React, { FC } from 'react';
import styled from 'styled-components';
import { List, Typography, Divider, CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import { PublicationListItem } from '../../types/publication.types';
import Heading from '../../components/Heading';
import { useTranslation } from 'react-i18next';
import useFetchLatestPublications from '../../utils/hooks/useFetchLatestPublications';
import { StyledProgressWrapper } from '../../components/styled/Wrappers';
import NormalText from '../../components/NormalText';
import PublicationListItemComponent from './PublicationListItemComponent';

const StyledListContainer = styled.div`
  padding-bottom: 1rem;
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
              <PublicationListItemComponent
                key={publication.identifier}
                primaryComponent={
                  <MuiLink component={Link} to={`/publication/${publication.identifier}/public`}>
                    {publication.mainTitle}
                  </MuiLink>
                }
                secondaryComponent={
                  <Typography component="span">
                    {new Date(publication.modifiedDate).toLocaleDateString()} - {publication.owner}
                  </Typography>
                }
              />
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
