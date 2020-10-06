import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { Link as RouterLink } from 'react-router-dom';
import { PublicationStatus } from '../../../types/publication.types';
import PublicationList from './PublicationList';
import TabButton from '../../../components/TabButton';
import useFetchMyPublications from '../../../utils/hooks/useFetchMyPublications';
import {
  StyledRightAlignedButtonWrapper,
  StyledCenterAlignedContentWrapper,
} from '../../../components/styled/Wrappers';
import ListSkeleton from '../../../components/ListSkeleton';
import Card from '../../../components/Card';
import { PageHeader } from '../../../components/PageHeader';

const StyledContainer = styled.div`
  width: 100%;
`;

const StyledTabsContainer = styled(StyledCenterAlignedContentWrapper)`
  margin-bottom: 1rem;
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
    <>
      <PageHeader>{t('my_registrations')}</PageHeader>
      <StyledContainer>
        <StyledRightAlignedButtonWrapper>
          {user.authority && (
            <Button
              color="primary"
              component={RouterLink}
              to={`/user/${user.authority.systemControlNumber}`}
              data-testid="public-profile-button">
              {t('go_to_public_profile')}
            </Button>
          )}
        </StyledRightAlignedButtonWrapper>
        <StyledTabsContainer>
          <TabButton
            data-testid="unpublished-button"
            onClick={() => setSelectedTab(Tab.Unpublished)}
            isSelected={selectedTab === Tab.Unpublished}>
            {t('unpublished_registrations')} ({unpublishedPublications.length})
          </TabButton>
          <TabButton
            data-testid="published-button"
            onClick={() => setSelectedTab(Tab.Published)}
            isSelected={selectedTab === Tab.Published}>
            {t('published_registrations')} ({publishedPublications.length})
          </TabButton>
        </StyledTabsContainer>
        <Card>
          {isLoading ? (
            <ListSkeleton minWidth={100} maxWidth={100} height={100} />
          ) : (
            <PublicationList
              publications={selectedTab === Tab.Unpublished ? unpublishedPublications : publishedPublications}
            />
          )}
        </Card>
      </StyledContainer>
    </>
  );
};

export default MyPublications;
