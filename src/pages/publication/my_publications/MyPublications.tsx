import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { Link as RouterLink } from 'react-router-dom';
import { PublicationStatus } from '../../../types/publication.types';
import PublicationList from './PublicationList';
import TabButton from '../../../components/TabButton';
import useFetchMyPublications from '../../../utils/hooks/useFetchMyPublications';
import { ProgressWrapper, RightAlignedButtonWrapper } from '../../../components/styled/Wrappers';

const StyledContainer = styled.div`
  display: block;
  width: 100%;
  margin: 0 2rem 2rem 2rem;
`;

const StyledTabsContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 2rem;
`;

enum Tab {
  Published,
  Unpublished,
}

const MyPublications: FC = () => {
  const { t } = useTranslation('workLists');
  const user = useSelector((store: RootStore) => store.user);
  const [selectedTab, setSelectedTab] = useState(Tab.Unpublished);
  const [publications, isLoading] = useFetchMyPublications();

  const unpublishedPublications = publications
    .filter((publication) => publication.status !== PublicationStatus.PUBLISHED)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  const publishedPublications = publications
    .filter((publication) => publication.status === PublicationStatus.PUBLISHED)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  return (
    <StyledContainer>
      <RightAlignedButtonWrapper>
        {user.authority && (
          <Button
            color="primary"
            component={RouterLink}
            to={`/profile/${user.authority.systemControlNumber}`}
            data-testid="public-profile-button">
            {t('go_to_public_profile')}
          </Button>
        )}
      </RightAlignedButtonWrapper>
      <StyledTabsContainer>
        <TabButton
          data-testid="unpublished-button"
          onClick={() => setSelectedTab(Tab.Unpublished)}
          isSelected={selectedTab === Tab.Unpublished}>
          {t('unpublished_publications')} ({unpublishedPublications.length})
        </TabButton>
        <TabButton
          data-testid="published-button"
          onClick={() => setSelectedTab(Tab.Published)}
          isSelected={selectedTab === Tab.Published}>
          {t('published_publications')} ({publishedPublications.length})
        </TabButton>
      </StyledTabsContainer>
      {isLoading ? (
        <ProgressWrapper>
          <CircularProgress color="primary" size={50} />
        </ProgressWrapper>
      ) : (
        <PublicationList
          publications={selectedTab === Tab.Unpublished ? unpublishedPublications : publishedPublications}
        />
      )}
    </StyledContainer>
  );
};

export default MyPublications;
