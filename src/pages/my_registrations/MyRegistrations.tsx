import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { ListSkeleton } from '../../components/ListSkeleton';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { TabButton } from '../../components/TabButton';
import { MyRegistrationsResponse, RegistrationStatus } from '../../types/registration.types';
import { MyRegistrationsList } from './MyRegistrationsList';
import { useFetch } from '../../utils/hooks/useFetch';
import { PublicationsApiPath } from '../../api/apiPaths';

enum Tab {
  Published,
  Unpublished,
}

export const MyRegistrations = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(Tab.Unpublished);
  const [myRegistrationsResponse, isLoading, refetchRegistrations] = useFetch<MyRegistrationsResponse>({
    url: PublicationsApiPath.RegistrationsByOwner,
    errorMessage: t('feedback.error.get_registrations'),
    withAuthentication: true,
  });
  const registrations = myRegistrationsResponse?.publications ?? [];

  const unpublishedRegistrations = registrations
    .filter(({ status }) => status === RegistrationStatus.Draft)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  const publishedRegistrations = registrations
    .filter(({ status }) => status === RegistrationStatus.Published || status === RegistrationStatus.PublishedMetadata)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  return (
    <>
      <Helmet>
        <title>{t('common.registrations')}</title>
      </Helmet>
      <BackgroundDiv>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <TabButton
            data-testid="unpublished-button"
            onClick={() => setSelectedTab(Tab.Unpublished)}
            isSelected={selectedTab === Tab.Unpublished}>
            {t('my_page.registrations.unpublished_registrations')} ({unpublishedRegistrations.length})
          </TabButton>
          <TabButton
            data-testid="published-button"
            onClick={() => setSelectedTab(Tab.Published)}
            isSelected={selectedTab === Tab.Published}>
            {t('my_page.registrations.published_registrations')} ({publishedRegistrations.length})
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
      </BackgroundDiv>
    </>
  );
};
