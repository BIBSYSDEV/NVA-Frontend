import { Box, Link, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchRegistration } from '../../api/registrationApi';
import { PageSpinner } from '../../components/PageSpinner';
import { Registration, RegistrationStatus } from '../../types/registration.types';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { getTitleString } from '../../utils/registration-helpers';

interface DeletePublicationInformationProps {
  registration: Registration;
}

export const DeletedPublicationInformation = ({ registration }: DeletePublicationInformationProps) => {
  const { t } = useTranslation();

  const originalIdentifier = registration.duplicateOf ? getIdentifierFromId(registration.duplicateOf) : '';

  const originalRegistrationQuery = useQuery({
    queryKey: ['registration', originalIdentifier],
    queryFn: () => fetchRegistration(originalIdentifier ?? ''),
    enabled: !!originalIdentifier,
  });
  const originalRegistration = originalRegistrationQuery.data;

  const originalRegistrationMainTitle = getTitleString(originalRegistration?.entityDescription?.mainTitle);

  return (
    <>
      {(registration.status === RegistrationStatus.Deleted ||
        registration.status === RegistrationStatus.Unpublished) && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'registration.main',
              padding: '1rem',
              my: '1rem',
            }}>
            <Typography variant="h2" component="h1">
              {t('registration.result_is_deleted_or_unpublished', {
                status: t(`registration.status.${registration.status}`).toLowerCase(),
              })}
            </Typography>
          </Box>

          {registration.duplicateOf && (
            <Box
              aria-live="polite"
              aria-busy={originalRegistrationQuery.isLoading}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: 'registration.main',
                padding: '1rem',
                my: '1rem',
              }}>
              {originalRegistrationQuery.isLoading ? (
                <PageSpinner aria-label={t('registration.citation_points_to')} />
              ) : (
                <Typography>
                  {`${t('registration.citation_points_to')} `}
                  <Link href={`/registration/${originalIdentifier}`}>{originalRegistrationMainTitle}</Link>
                </Typography>
              )}
            </Box>
          )}
        </>
      )}
    </>
  );
};
