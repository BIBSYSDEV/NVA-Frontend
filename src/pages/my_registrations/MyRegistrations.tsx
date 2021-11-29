import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { ListSkeleton } from '../../components/ListSkeleton';
import { PageHeader } from '../../components/PageHeader';
import {
  StyledCenterAlignedContentWrapper,
  StyledPageWrapperWithMaxWidth,
  StyledRightAlignedWrapper,
} from '../../components/styled/Wrappers';
import { TabButton } from '../../components/TabButton';
import { RootStore } from '../../redux/reducers/rootReducer';
import { MyRegistrationsResponse, RegistrationStatus } from '../../types/registration.types';
import { getUserPath } from '../../utils/urlPaths';
import { MyRegistrationsList } from './MyRegistrationsList';
import { useFetch } from '../../utils/hooks/useFetch';
import { PublicationsApiPath } from '../../api/apiPaths';
import { BackgroundDiv } from '../../components/BackgroundDiv';

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

const MyRegistrations = () => {
  const { t } = useTranslation('workLists');
  const user = useSelector((store: RootStore) => store.user);
  const [selectedTab, setSelectedTab] = useState(Tab.Unpublished);
  const [myRegistrationsResponse, isLoading, refetchRegistrations] = useFetch<MyRegistrationsResponse>({
    url: PublicationsApiPath.RegistrationsByOwner,
    errorMessage: t('feedback:error.get_registrations'),
    withAuthentication: true,
  });
  const registrations = myRegistrationsResponse?.publications ?? [];

  const unpublishedRegistrations = registrations
    .filter((registration) => registration.status === RegistrationStatus.Draft)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  const publishedRegistrations = registrations
    .filter((registration) => registration.status === RegistrationStatus.Published)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('my_registrations')}</PageHeader>
      <StyledContainer>
        <StyledRightAlignedWrapper>
          {user?.authority && (
            <Button component={RouterLink} to={getUserPath(user.authority.id)} data-testid="public-profile-button">
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
        <BackgroundDiv>
          {isLoading ? (
            <ListSkeleton minWidth={100} maxWidth={100} height={100} />
          ) : (
            <MyRegistrationsList
              registrations={selectedTab === Tab.Unpublished ? unpublishedRegistrations : publishedRegistrations}
              refetchRegistrations={refetchRegistrations}
            />
          )}
        </BackgroundDiv>
      </StyledContainer>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default MyRegistrations;
