import { useFetchNviCandidate } from '../../../../../api/hooks/useFetchNviCandidate';
import { useFetchRegistration } from '../../../../../api/hooks/useFetchRegistration';
import { getIdentifierFromId } from '../../../../../utils/general-helpers';

/**
 * Fetches an NVI candidate and its associated registration sequentially —
 * the registration fetch depends on the publicationId returned by the candidate fetch.
 *
 * @param identifier - The NVI candidate identifier. Queries are skipped if undefined.
 * @returns Combined pending/error state, the NVI candidate, its registration, and a refetch function.
 */
export const useFetchNviCandidateData = (identifier?: string) => {
  const {
    data: nviCandidate,
    refetch,
    error: candidateError,
    isPending: candidateIsPending,
  } = useFetchNviCandidate(identifier);
  const registrationIdentifier = getIdentifierFromId(nviCandidate?.publicationId ?? '');
  const {
    data: registration,
    error: registrationError,
    isPending: registrationIsPending,
  } = useFetchRegistration(registrationIdentifier);

  return {
    refetch,
    isPending: candidateIsPending || registrationIsPending,
    error: candidateError || registrationError,
    registration,
    nviCandidate,
  };
};
