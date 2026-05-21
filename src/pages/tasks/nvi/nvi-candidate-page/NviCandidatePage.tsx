import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { nviCandidateQueryKeyword } from '../../../../api/hooks/useFetchNviCandidate';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import { PageWithRightSideMenu } from '../../../../components/page-layouts/PageWithRightSideMenu';
import { PageSpinner } from '../../../../components/PageSpinner';
import { NviCandidateProblemsContext } from '../../../../context/NviCandidateProblemsContext';
import { IdentifierParams } from '../../../../utils/urlPaths';
import { Forbidden } from '../../../errorpages/Forbidden';
import NotFound from '../../../errorpages/NotFound';
import { NviCandidateActionPanel } from '../../../messages/components/NviCandidateActionPanel';
import { PublicRegistrationContent } from '../../../public_registration/PublicRegistrationContent';
import { NviCandidateNavigation } from './_components/NviCandidateNavigation';
import { useFetchNviCandidateData } from './_hooks/useFetchNviCandidateData';

export const NviCandidatePage = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();
  const { nviCandidate, registration, refetch, error, isPending } = useFetchNviCandidateData(identifier);
  const [isUpdatingNviCandidateInfo, setIsUpdatingNviCandidateInfo] = useState(true);

  /* Disabling the panel for a few seconds before refetching NVI data to ensure it shows correct information (NP-49727).
   * This is done on initial load in case the load is a return from edit - does not affect loads after navigation */
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch().finally(() => {
        setIsUpdatingNviCandidateInfo(false);
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [identifier, refetch]);

  if (error?.response?.status === 401) return <Forbidden />;
  if (error) return <NotFound />;
  if (isPending) return <PageSpinner aria-label={t('common.result')} />;
  if (!nviCandidate || !registration) return <NotFound />;

  return (
    <ErrorBoundary>
      <PageWithRightSideMenu
        main={
          <Box sx={{ position: 'relative' }}>
            <NviCandidateProblemsContext.Provider value={{ problems: nviCandidate!.problems }}>
              <PublicRegistrationContent registration={registration} />
            </NviCandidateProblemsContext.Provider>
            <NviCandidateNavigation />
          </Box>
        }
        sidebar={
          <NviCandidateActionPanel
            nviCandidate={nviCandidate!}
            isUpdatingNviCandidateInfo={isUpdatingNviCandidateInfo}
            nviCandidateQueryKey={[nviCandidateQueryKeyword, identifier ?? '']}
          />
        }
      />
    </ErrorBoundary>
  );
};
