import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useFetchNviCandidates } from '../../../../../api/hooks/useFetchNviCandidates';
import { NviCandidatePageLocationState } from '../../../../../types/locationState.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { getNviCandidatePath } from '../../../../../utils/urlPaths';
import { generateLocationState } from '../_utils/generate-location-state';
import { NavigationIconButton } from './NavigationIconButton';

export const NviCandidateNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const locationState = location.state as NviCandidatePageLocationState;

  const nviQueryParams = locationState?.candidateOffsetState?.nviQueryParams;
  const thisCandidateOffset = locationState?.candidateOffsetState?.currentOffset;

  const hasOffset = typeof thisCandidateOffset === 'number';
  const isFirstCandidate = hasOffset && thisCandidateOffset === 0;

  const newNviQueryParams = { ...nviQueryParams };

  if (hasOffset && nviQueryParams) {
    newNviQueryParams.offset = Math.max(thisCandidateOffset - 1, 0);
  }

  const navigateCandidateQuery = useFetchNviCandidates({
    enabled: hasOffset && !!nviQueryParams,
    params: newNviQueryParams,
  });

  const nextCandidateIdentifier = navigateCandidateQuery.isSuccess
    ? navigateCandidateQuery.data.hits[isFirstCandidate ? 1 : 2]?.identifier
    : null;
  const previousCandidateIdentifier =
    navigateCandidateQuery.isSuccess && !isFirstCandidate ? navigateCandidateQuery.data.hits[0]?.identifier : null;

  const nextCandidateState =
    hasOffset && nviQueryParams
      ? generateLocationState(locationState, newNviQueryParams, thisCandidateOffset + 1)
      : undefined;

  const previousCandidateState =
    hasOffset && nviQueryParams
      ? generateLocationState(locationState, newNviQueryParams, thisCandidateOffset - 1)
      : undefined;

  return (
    <>
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
    </>
  );
};
