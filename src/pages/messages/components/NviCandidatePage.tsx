import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import { useFetchNviCandidates } from '../../../api/hooks/useFetchNviCandidates';
import { useFetchRegistration } from '../../../api/hooks/useFetchRegistration';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { PageSpinner } from '../../../components/PageSpinner';
import { NviCandidateProblemsContext } from '../../../context/NviCandidateProblemsContext';
import { NviCandidatePageLocationState } from '../../../types/locationState.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { getNviCandidatePath, IdentifierParams } from '../../../utils/urlPaths';
import { Forbidden } from '../../errorpages/Forbidden';
import NotFound from '../../errorpages/NotFound';
import { PublicRegistrationContent } from '../../public_registration/PublicRegistrationContent';
import { NavigationIconButton } from './NavigationIconButton';
import { NviCandidateActionPanel } from './NviCandidateActionPanel';
import { nviCandidateQueryKeyword, useFetchNviCandidate } from '../../../api/hooks/useFetchNviCandidate';

export const NviCandidatePage = () => {
  const { t } = useTranslation();
  const [isUpdatingNviCandidateInfo, setIsUpdatingNviCandidateInfo] = useState(true);
  const location = useLocation();
  const locationState = location.state as NviCandidatePageLocationState;
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

  const nviQueryParams = location.state?.candidateOffsetState?.nviQueryParams;
  const thisCandidateOffset = locationState?.candidateOffsetState?.currentOffset;

  const hasOffset = typeof thisCandidateOffset === 'number';
  const isFirstCandidate = hasOffset && thisCandidateOffset === 0;

  if (hasOffset && nviQueryParams) {
    nviQueryParams.offset = Math.max(thisCandidateOffset - 1, 0);
  }
  const navigateCandidateQuery = useFetchNviCandidates({
    enabled: hasOffset && !!nviQueryParams,
    params: nviQueryParams ?? {},
  });

  const nextCandidateIdentifier = navigateCandidateQuery.isSuccess
    ? navigateCandidateQuery.data.hits[isFirstCandidate ? 1 : 2]?.identifier
    : null;
  const previousCandidateIdentifier =
    navigateCandidateQuery.isSuccess && !isFirstCandidate ? navigateCandidateQuery.data.hits[0]?.identifier : null;

  const nextCandidateState =
    hasOffset && nviQueryParams
      ? ({
          ...location.state,
          candidateOffsetState: {
            currentOffset: thisCandidateOffset + 1,
            nviQueryParams,
          },
        } satisfies NviCandidatePageLocationState)
      : undefined;

  const previousCandidateState =
    hasOffset && nviQueryParams
      ? ({
          ...locationState,
          candidateOffsetState: {
            currentOffset: thisCandidateOffset - 1,
            nviQueryParams,
          },
        } satisfies NviCandidatePageLocationState)
      : undefined;

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

            {previousCandidateIdentifier && (
              <NavigationIconButton
                data-testid={dataTestId.tasksPage.nvi.previousCandidateButton}
                to={getNviCandidatePath(previousCandidateIdentifier)}
                state={previousCandidateState}
                title={t('tasks.nvi.previous_candidate')}
                navigateTo={'previous'}
                sx={{
                  gridArea: 'registration',
                  left: '-1rem',
                }}
              />
            )}

            {nextCandidateIdentifier && (
              <NavigationIconButton
                data-testid={dataTestId.tasksPage.nvi.nextCandidateButton}
                to={getNviCandidatePath(nextCandidateIdentifier)}
                state={nextCandidateState}
                title={t('tasks.nvi.next_candidate')}
                navigateTo={'next'}
                sx={{
                  gridArea: 'registration',
                  right: '-1rem',
                }}
              />
            )}
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
