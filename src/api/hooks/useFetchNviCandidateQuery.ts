import { useQuery } from '@tanstack/react-query';
import { RegistrationStatus } from '../../types/registration.types';
import { fetchNviCandidateForRegistration } from '../scientificIndexApi';

export const useFetchNviCandidateQuery = (registrationId: string, registrationStatus: RegistrationStatus) => {
  const canHaveNviCandidate =
    registrationStatus === RegistrationStatus.Published || registrationStatus === RegistrationStatus.PublishedMetadata;

  return useQuery({
    enabled: !!registrationId && canHaveNviCandidate,
    queryKey: ['nviCandidateForRegistration', registrationId],
    queryFn: () => fetchNviCandidateForRegistration(registrationId),
    retry: false,
    meta: { errorMessage: false },
  });
};
