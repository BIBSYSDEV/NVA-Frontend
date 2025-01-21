import { Box, Link as MuiLink, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useFetchRegistration } from '../../api/hooks/useFetchRegistration';
import { Registration, RegistrationStatus } from '../../types/registration.types';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { getTitleString } from '../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';

interface DeletePublicationInformationProps {
  registration: Registration;
}

export const DeletedPublicationInformation = ({ registration }: DeletePublicationInformationProps) => {
  const { t } = useTranslation();

  const originalIdentifier = registration.duplicateOf ? getIdentifierFromId(registration.duplicateOf) : '';

  const originalRegistrationQuery = useFetchRegistration(originalIdentifier);
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
              aria-busy={originalRegistrationQuery.isPending}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: 'registration.main',
                padding: '1rem',
                my: '1rem',
              }}>
              {originalRegistrationQuery.isPending ? (
                <Skeleton sx={{ width: '50%' }} aria-label={t('registration.citation_points_to')} />
              ) : (
                <Typography>
                  {`${t('registration.citation_points_to')} `}
                  <MuiLink component={Link} to={getRegistrationLandingPagePath(originalIdentifier)}>
                    {originalRegistrationMainTitle}
                  </MuiLink>
                </Typography>
              )}
            </Box>
          )}
        </>
      )}
    </>
  );
};
