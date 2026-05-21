import { FetchNviCandidatesParams } from '../../../../../api/searchApi';
import { NviCandidatePageLocationState } from '../../../../../types/locationState.types';

/*
 * Generates a new NviCandidatePageLocationState with updated candidateOffsetState,
 * so that prev/next navigation works correctly on the NVI candidate detail page.
 * @param locationState - the current location state to base the new state on
 * @param newQueryParams - the NVI query params used to fetch the current candidate list
 * @param newOffset - the offset of the next / previous candidate in the list
 * @returns a new NviCandidatePageLocationState with updated candidateOffsetState
 */
export const generateLocationState = (
  locationState: NviCandidatePageLocationState,
  newQueryParams: FetchNviCandidatesParams,
  newOffset: number
) =>
  ({
    ...locationState,
    candidateOffsetState: {
      currentOffset: newOffset,
      nviQueryParams: newQueryParams,
    },
  }) satisfies NviCandidatePageLocationState;
