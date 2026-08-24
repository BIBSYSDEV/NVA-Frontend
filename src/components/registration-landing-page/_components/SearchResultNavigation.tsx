import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useRegistrationSearch } from '../../../api/hooks/useRegistrationSearch';
import { ListNavigationButtonBack } from '../../../pages/tasks/_components/ListNavigationButtonBack';
import { ListNavigationButtonNext } from '../../../pages/tasks/_components/ListNavigationButtonNext';
import { SearchResultLocationState } from '../../../types/locationState.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getRegistrationLandingPagePath } from '../../../utils/urlPaths';
import { updateSearchResultOffset } from '../_utils/search-result-navigation-state';

const MAX_RESULT_WINDOW = 10_000; // OpenSearch's default index.max_result_window: from + results must not exceed this.

/**
 * Renders prev/next arrow buttons for browsing between search results from the registration landing page,
 * without returning to the result list. Reads {@link SearchResultLocationState.searchResultOffsetState} from
 * the router location state to know the current result's position and the search params used to find it, then
 * refetches a 3-item window around that position to resolve the neighboring identifiers.
 *
 * Meant to be mounted unconditionally on the landing page: it renders nothing when the location state has no
 * offset state, which is the case unless the user navigated here from a search result list.
 */
export const SearchResultNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const locationState = location.state as SearchResultLocationState;

  const searchParams = locationState?.searchResultOffsetState?.searchParams;
  const currentOffset = locationState?.searchResultOffsetState?.currentOffset;
  const hasOffset = typeof currentOffset === 'number';
  const isFirst = hasOffset && currentOffset === 0;

  const navigationParams = { ...searchParams };
  if (hasOffset && searchParams) {
    navigationParams.from = Math.max(currentOffset - 1, 0);
    // Only fetching previous, current and next result, but clamped so from + results never exceeds
    // OpenSearch's default index.max_result_window (10 000), which would otherwise cause a 400 near the end.
    navigationParams.results = Math.min(3, MAX_RESULT_WINDOW - navigationParams.from);
  }

  const navigationQuery = useRegistrationSearch({
    enabled: hasOffset && !!searchParams,
    params: navigationParams,
  });

  const hasNavigationData = hasOffset && !!searchParams && navigationQuery.isSuccess;

  const previousResultIdentifier = hasNavigationData && !isFirst ? navigationQuery.data.hits[0]?.identifier : null;
  const nextResultIdentifier = hasNavigationData ? navigationQuery.data.hits[isFirst ? 1 : 2]?.identifier : null;

  return (
    <>
      {previousResultIdentifier && (
        <ListNavigationButtonBack
          to={getRegistrationLandingPagePath(previousResultIdentifier)}
          state={updateSearchResultOffset(locationState, currentOffset! - 1, searchParams!)}
          replace
          title={t('search.previous_result')}
          dataTestId={dataTestId.startPage.previousResultButton}
        />
      )}
      {nextResultIdentifier && (
        <ListNavigationButtonNext
          to={getRegistrationLandingPagePath(nextResultIdentifier)}
          state={updateSearchResultOffset(locationState, currentOffset! + 1, searchParams!)}
          replace
          title={t('search.next_result')}
          dataTestId={dataTestId.startPage.nextResultButton}
        />
      )}
    </>
  );
};
