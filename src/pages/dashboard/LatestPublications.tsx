import React, { FC } from 'react';
import styled from 'styled-components';
import { List, CircularProgress, Divider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import useFetchLatestPublications from '../../utils/hooks/useFetchLatestPublications';
import { StyledProgressWrapper } from '../../components/styled/Wrappers';
import NormalText from '../../components/NormalText';
import PublicationListItemComponent from './PublicationListItemComponent';
import Heading from '../../components/Heading';

const StyledListContainer = styled.div`
  margin-top: 2rem;
`;

const StyledNormalText = styled(NormalText)`
  margin-top: 1rem;
`;

const LatestPublications: FC = () => {
  const { t } = useTranslation('publication');
  const [publications, isLoadingPublications] = useFetchLatestPublications();

  return (
    <StyledListContainer data-testid="latest-publications">
      <Heading>{t('publication.latest_publications')}</Heading>
      <Divider />
      {isLoadingPublications ? (
        <StyledProgressWrapper>
          <CircularProgress />
        </StyledProgressWrapper>
      ) : publications.length > 0 ? (
        <>
          <List>
            {publications.map((publication) => (
              <PublicationListItemComponent
                key={publication.identifier}
                primaryComponent={
                  <MuiLink component={Link} to={`/registration/${publication.identifier}/public`}>
                    {publication.mainTitle}
                  </MuiLink>
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
