import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { RootStore } from '../../redux/reducers/rootReducer';
import { Link as RouterLink } from 'react-router-dom';
import { RegistrationStatus } from '../../types/registration.types';
import RegistrationList from './RegistrationList';
import TabButton from '../../components/TabButton';
import useFetchMyRegistrations from '../../utils/hooks/useFetchMyRegistrations';
import { StyledRightAlignedWrapper, StyledCenterAlignedContentWrapper } from '../../components/styled/Wrappers';
import ListSkeleton from '../../components/ListSkeleton';
import Card from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { getUserPath } from '../../utils/urlPaths';

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

const MyRegistrations: FC = () => {
  const { t } = useTranslation('workLists');
  const user = useSelector((store: RootStore) => store.user);
  const [selectedTab, setSelectedTab] = useState(Tab.Unpublished);
  const [registrations, isLoading, refetchRegistrations] = useFetchMyRegistrations();

  const unpublishedRegistrations = registrations
    .filter((registration) => registration.status === RegistrationStatus.DRAFT)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  const publishedRegistrations = registrations
    .filter((registration) => registration.status === RegistrationStatus.PUBLISHED)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  return (
    <>
      <PageHeader>{t('my_registrations')}</PageHeader>
      <StyledContainer>
        <StyledRightAlignedWrapper>
          {user.authority && (
            <Button
              color="primary"
              component={RouterLink}
              to={getUserPath(user.authority.id)}
              data-testid="public-profile-button">
              {t('go_to_public_profile')}
            </Button>
          )}
        </StyledRightAlignedWrapper>
        <StyledTabsContainer>
          <TabButton
            data-testid="unpublished-button"
            onClick={() => setSelectedTab(Tab.Unpublished)}
            isSelected={selectedTab === Tab.Unpublished}>
            {t('unpublished_registrations')} ({unpublishedRegistrations.length})
          </TabButton>
          <TabButton
            data-testid="published-button"
            onClick={() => setSelectedTab(Tab.Published)}
            isSelected={selectedTab === Tab.Published}>
            {t('published_registrations')} ({publishedRegistrations.length})
          </TabButton>
        </StyledTabsContainer>
        <Card>
          {isLoading ? (
            <ListSkeleton minWidth={100} maxWidth={100} height={100} />
          ) : (
            <RegistrationList
              registrations={selectedTab === Tab.Unpublished ? unpublishedRegistrations : publishedRegistrations}
              refetchRegistrations={refetchRegistrations}
            />
          )}
        </Card>
      </StyledContainer>
    </>
  );
};

export default MyRegistrations;
