import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { nviCandidateQueryKeyword, useFetchNviCandidate } from '../../../../api/hooks/useFetchNviCandidate';
import { useFetchRegistration } from '../../../../api/hooks/useFetchRegistration';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import { PageSpinner } from '../../../../components/PageSpinner';
import { NviCandidateProblemsContext } from '../../../../context/NviCandidateProblemsContext';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { IdentifierParams } from '../../../../utils/urlPaths';
import { Forbidden } from '../../../errorpages/Forbidden';
import NotFound from '../../../errorpages/NotFound';
import { NviCandidateActionPanel } from '../../../messages/components/NviCandidateActionPanel';
import { PublicRegistrationContent } from '../../../public_registration/PublicRegistrationContent';
import { NviCandidateNavigation } from './_components/NviCandidateNavigation';
import { useFetchNviCandidateData } from './_hooks/useFetchNviCandidateData';

export const NviCandidatePage = () => {
  const { t } = useTranslation();
  const [isUpdatingNviCandidateInfo, setIsUpdatingNviCandidateInfo] = useState(true);
  const { identifier } = useParams<IdentifierParams>();
  const nviCandidateQuery = useFetchNviCandidate(identifier);
  const { refetch } = nviCandidateQuery;
  const nviCandidate = nviCandidateQuery.data;
  const registrationIdentifier = getIdentifierFromId(nviCandidate?.publicationId ?? '');

  /* NVI calculation in backend takes a few seconds after a registration has been updated, so we are disabling the
   * panel for a few seconds before refetching to ensure it shows the correct data (NP-49727) */
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch().finally(() => {
        setIsUpdatingNviCandidateInfo(false);
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [identifier, refetch]);

  const registrationQuery = useFetchRegistration(registrationIdentifier);

  if (nviCandidateQuery.error?.response?.status === 401) {
    return <Forbidden />;
  }

  if (nviCandidateQuery.error?.response?.status === 404) {
    return <NotFound />;
  }

  return registrationQuery.isPending || nviCandidateQuery.isPending ? (
    <PageSpinner aria-label={t('common.result')} />
  ) : (
    <Box
      component="section"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '4fr 1fr' },
        gridTemplateAreas: { xs: '"nvi" "registration"', sm: '"registration nvi"' },
        gap: '1rem',
      }}>
      {registrationQuery.data && (
        <ErrorBoundary>
          <ErrorBoundary>
            <NviCandidateProblemsContext.Provider value={{ problems: nviCandidate?.problems }}>
              <PublicRegistrationContent registration={registrationQuery.data} />
            </NviCandidateProblemsContext.Provider>
            <NviCandidateNavigation />
          </ErrorBoundary>

          {nviCandidate && (
            <NviCandidateActionPanel
              nviCandidate={nviCandidate}
              isUpdatingNviCandidateInfo={isUpdatingNviCandidateInfo}
              nviCandidateQueryKey={[nviCandidateQueryKeyword, identifier ?? '']}
            />
          )}
        </ErrorBoundary>
      )}
    </Box>
  );
};
