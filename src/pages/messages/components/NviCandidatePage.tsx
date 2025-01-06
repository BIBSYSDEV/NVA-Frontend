import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useFetchNviCandidates } from '../../../api/hooks/useFetchNviCandidates';
import { useFetchRegistration } from '../../../api/hooks/useFetchRegistration';
import { fetchNviCandidate } from '../../../api/searchApi';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { PageSpinner } from '../../../components/PageSpinner';
import { NviCandidatePageLocationState } from '../../../types/locationState.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { getNviCandidatePath, IdentifierParams } from '../../../utils/urlPaths';
import { Forbidden } from '../../errorpages/Forbidden';
import NotFound from '../../errorpages/NotFound';
import { PublicRegistrationContent } from '../../public_registration/PublicRegistrationContent';
import { NavigationIconButton } from './NavigationIconButton';
import { NviCandidateActionPanel } from './NviCandidateActionPanel';

export const NviCandidatePage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const locationState = location.state as NviCandidatePageLocationState;
  const { identifier } = useParams<IdentifierParams>();

  const nviCandidateQueryKey = ['nviCandidate', identifier ?? ''];
  const nviCandidateQuery = useQuery({
    enabled: !!identifier,
    queryKey: nviCandidateQueryKey,
    queryFn: () => fetchNviCandidate(identifier ?? ''),
    meta: { errorMessage: t('feedback.error.get_nvi_candidate') },
    retry(failureCount, error: Pick<AxiosError, 'response'>) {
      if (error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const nviCandidate = nviCandidateQuery.data;
  const registrationIdentifier = getIdentifierFromId(nviCandidate?.publicationId ?? '');

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
            <PublicRegistrationContent registration={registrationQuery.data} />

            {previousCandidateIdentifier && (
              <NavigationIconButton
                data-testid={dataTestId.tasksPage.nvi.previousCandidateButton}
                to={{
                  pathname: getNviCandidatePath(previousCandidateIdentifier),
                }}
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
                to={{
                  pathname: getNviCandidatePath(nextCandidateIdentifier),
                }}
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
            <NviCandidateActionPanel nviCandidate={nviCandidate} nviCandidateQueryKey={nviCandidateQueryKey} />
          )}
        </ErrorBoundary>
      )}
    </Box>
  );
};
