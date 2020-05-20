import React, { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Button, CircularProgress, Card } from '@material-ui/core';
import styled from 'styled-components';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { Link as RouterLink } from 'react-router-dom';
import { getMyPublications } from '../../../api/publicationApi';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import { PublicationPreview, PublicationStatus } from '../../../types/publication.types';
import PublicationList from './PublicationList';
import TabButton from '../../../components/TabButton';

const StyledContainer = styled.div`
  display: block;
  width: 100%;
  margin: 0 2rem 2rem 2rem;
`;

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 1rem;
  height: 3rem;
`;

const StyledTabsContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  margin: 0 1.5rem;
`;

const StyledProgressContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 2rem;
`;

const StyledCard = styled(Card)`
  margin: 0 1.5rem;
  width: auto;
`;

enum Tab {
  Published,
  Unpublished,
}

const MyPublications: FC = () => {
  const { t } = useTranslation('workLists');
  const dispatch = useDispatch();
  const user = useSelector((store: RootStore) => store.user);
  const [selectedTab, setSelectedTab] = useState(Tab.Unpublished);
  const [isLoading, setIsLoading] = useState(true);
  const [publications, setPublications] = useState<PublicationPreview[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const publications = await getMyPublications();
      if (publications?.error) {
        dispatch(setNotification(publications.error, NotificationVariant.Error));
      } else {
        setPublications(publications);
      }
      setIsLoading(false);
    };
    loadData();
  }, [dispatch]);

  const unpublishedPublications = publications
    .filter((publication) => publication.status !== PublicationStatus.PUBLISHED)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  const publishedPublications = publications
    .filter((publication) => publication.status === PublicationStatus.PUBLISHED)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  return (
    <StyledContainer>
      <StyledButtonWrapper>
        {user.authority && (
          <Button
            color="primary"
            component={RouterLink}
            to={`/profile/${user.authority.systemControlNumber}`}
            data-testid="public-profile-button">
            {t('go_to_public_profile')}
          </Button>
        )}
      </StyledButtonWrapper>
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
        <StyledProgressContainer>
          <CircularProgress color="primary" size={50} />
        </StyledProgressContainer>
      ) : (
        <StyledCard>
          <PublicationList
            publications={selectedTab === Tab.Unpublished ? unpublishedPublications : publishedPublications}
          />
        </StyledCard>
      )}
    </StyledContainer>
  );
};

export default MyPublications;
