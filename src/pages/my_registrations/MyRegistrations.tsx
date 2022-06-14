import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { ListSkeleton } from '../../components/ListSkeleton';
import { StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import { TabButton } from '../../components/TabButton';
import { RootState } from '../../redux/store';
import { MyRegistrationsResponse, RegistrationStatus } from '../../types/registration.types';
import { getUserPath } from '../../utils/urlPaths';
import { MyRegistrationsList } from './MyRegistrationsList';
import { useFetch } from '../../utils/hooks/useFetch';
import { PublicationsApiPath } from '../../api/apiPaths';

enum Tab {
  Published,
  Unpublished,
}

export const MyRegistrations = () => {
  const { t } = useTranslation('workLists');
  const user = useSelector((store: RootState) => store.user);
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
    <>
      <Helmet>
        <title>{t('my_registrations')}</title>
      </Helmet>
      <StyledRightAlignedWrapper>
        {user?.cristinId && (
          <Button component={RouterLink} to={getUserPath(user.cristinId)} data-testid="public-profile-button">
            {t('go_to_public_profile')}
          </Button>
        )}
      </StyledRightAlignedWrapper>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
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
      </Box>
      {isLoading ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <MyRegistrationsList
          registrations={selectedTab === Tab.Unpublished ? unpublishedRegistrations : publishedRegistrations}
          refetchRegistrations={refetchRegistrations}
        />
      )}
    </>
  );
};
