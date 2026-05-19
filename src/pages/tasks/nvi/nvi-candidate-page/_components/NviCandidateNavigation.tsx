import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useFetchNviCandidates } from '../../../../../api/hooks/useFetchNviCandidates';
import { ListNavigationButtonBack } from '../../../../../components/_atoms/buttons/navigation/ListNavigationButtonBack';
import { ListNavigationButtonNext } from '../../../../../components/_atoms/buttons/navigation/ListNavigationButtonNext';
import { NviCandidatePageLocationState } from '../../../../../types/locationState.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { getNviCandidatePath } from '../../../../../utils/urlPaths';
import { generateLocationState } from '../_utils/generate-location-state';

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
    newNviQueryParams.offset = Math.max(thisCandidateOffset - 1, 0); // Setting the offset to the offset of the previous candidate, so that the upcoming fetch will return the previous and next candidates around the current one.
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
        <ListNavigationButtonBack
          to={getNviCandidatePath(previousCandidateIdentifier)}
          state={previousCandidateState}
          title={t('tasks.nvi.previous_candidate')}
          dataTestId={dataTestId.tasksPage.nvi.previousCandidateButton}
        />
      )}

      {nextCandidateIdentifier && (
        <ListNavigationButtonNext
          to={getNviCandidatePath(nextCandidateIdentifier)}
          state={nextCandidateState}
          title={t('tasks.nvi.next_candidate')}
          dataTestId={dataTestId.tasksPage.nvi.nextCandidateButton}
        />
      )}
    </>
  );
};
