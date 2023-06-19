import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { ListSkeleton } from '../../components/ListSkeleton';
import { RegistrationStatus } from '../../types/registration.types';
import { MyRegistrationsList } from './MyRegistrationsList';
import { fetchRegistrationsByOwner } from '../../api/registrationApi';

interface MyRegistrationsProps {
  selectedRegistrationStatus: {
    published: boolean;
    unpublished: boolean;
  };
}

export const MyRegistrations = ({ selectedRegistrationStatus }: MyRegistrationsProps) => {
  const { t } = useTranslation();

  const registrationsQuery = useQuery({
    queryKey: ['by-owner'],
    queryFn: fetchRegistrationsByOwner,
    meta: { errorMessage: t('feedback.error.search') },
  });

  const registrations = registrationsQuery.data?.publications ?? [];

  const unpublishedRegistrations = registrations
    .filter(({ status }) => status === RegistrationStatus.Draft)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  const publishedRegistrations = registrations
    .filter(({ status }) => status === RegistrationStatus.Published || status === RegistrationStatus.PublishedMetadata)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  const displayRegistrations = () => {
    if (selectedRegistrationStatus.published && !selectedRegistrationStatus.unpublished) {
      return publishedRegistrations;
    } else if (!selectedRegistrationStatus.published && selectedRegistrationStatus.unpublished) {
      return unpublishedRegistrations;
    } else {
      return unpublishedRegistrations.concat(publishedRegistrations);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('common.registrations')}</title>
      </Helmet>
      <>
        {registrationsQuery.isLoading ? (
          <ListSkeleton minWidth={100} maxWidth={100} height={100} />
        ) : (
          <Box>
            <Typography sx={{ lineHeight: '2.5rem' }} variant="h2">
              {t('common.registrations')}
            </Typography>
            <MyRegistrationsList
              registrations={displayRegistrations()}
              refetchRegistrations={registrationsQuery.refetch}
            />
          </Box>
        )}
      </>
    </>
  );
};
