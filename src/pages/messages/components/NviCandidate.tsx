import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { useParams } from 'react-router-dom';
import { fetchRegistration } from '../../../api/registrationApi';
import { fetchNviCandidate } from '../../../api/searchApi';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { PageSpinner } from '../../../components/PageSpinner';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { RegistrationParams } from '../../../utils/urlPaths';
import { PublicRegistrationContent } from '../../public_registration/PublicRegistrationContent';

export const NviCandidate = () => {
  const { identifier } = useParams<RegistrationParams>();

  const nviCandidateQuery = useQuery({
    queryKey: ['nviCandidate', identifier],
    queryFn: () => fetchNviCandidate(identifier),
    meta: { errorMessage: t('feedback.error.get_nvi_candidate') },
  });
  const registrationIdentifier = getIdentifierFromId(nviCandidateQuery.data?.publicationId ?? '');

  const registrationQuery = useQuery({
    enabled: !!registrationIdentifier,
    queryKey: ['registration', registrationIdentifier],
    queryFn: () => fetchRegistration(registrationIdentifier),
    meta: { errorMessage: t('feedback.error.get_registration') },
  });

  return (
    <Box
      component="section"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '4fr 1fr' },
        gridTemplateAreas: { xs: '"nvi" "registration"', sm: '"registration nvi"' },
        gap: '1rem',
      }}>
      {registrationQuery.isLoading || nviCandidateQuery.isLoading ? (
        <PageSpinner aria-label={t('common.result')} />
      ) : (
        registrationQuery.data && (
          <ErrorBoundary>
            <PublicRegistrationContent registration={registrationQuery.data} />
          </ErrorBoundary>
        )
      )}
    </Box>
  );
};
