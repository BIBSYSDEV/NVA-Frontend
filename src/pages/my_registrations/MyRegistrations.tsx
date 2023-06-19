import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { ListSkeleton } from '../../components/ListSkeleton';
import { RegistrationStatus } from '../../types/registration.types';
import { MyRegistrationsList } from './MyRegistrationsList';
import { fetchRegistrationsByOwner } from '../../api/registrationApi';

interface MyRegistrationsProps {
  selectedPublished: boolean;
  selectedUnpublished: boolean;
}

export const MyRegistrations = ({ selectedUnpublished, selectedPublished }: MyRegistrationsProps) => {
  const { t } = useTranslation();

  const registrationsQuery = useQuery({
    queryKey: ['by-owner'],
    queryFn: fetchRegistrationsByOwner,
    meta: { errorMessage: t('feedback.error.search') },
  });

  const registrations = registrationsQuery.data?.publications ?? [];

  const filteredRegistrations = registrations
    .filter(
      ({ status }) =>
        (status === RegistrationStatus.Draft && selectedUnpublished) ||
        ((status === RegistrationStatus.Published || status === RegistrationStatus.PublishedMetadata) &&
          selectedPublished)
    )
    .sort((a, b) => {
      if (a.status === RegistrationStatus.Draft || b.status !== RegistrationStatus.Draft) {
        return -1;
      } else if (b.status === RegistrationStatus.Draft) {
        return 1;
      }
      return 0;
    });

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
              registrations={filteredRegistrations}
              refetchRegistrations={registrationsQuery.refetch}
            />
          </Box>
        )}
      </>
    </>
  );
};
