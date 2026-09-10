import { FetchResultsParams } from '../../../api/searchApi';
import { SearchResultLocationState } from '../../../types/locationState.types';

/**
 * Returns a new navigation state with the offset updated, preserving all other state fields.
 * @param locationState - The current location state to base the new state on.
 * @param offset - The offset of the search result to navigate to.
 * @param searchParams - The search params used to fetch the current result list.
 * @returns A new state object with the updated offset.
 */
export const updateSearchResultOffset = (
  locationState: SearchResultLocationState,
  offset: number,
  searchParams: FetchResultsParams
): SearchResultLocationState => ({
  ...locationState,
  searchResultOffsetState: {
    currentOffset: offset,
    searchParams,
  },
});
