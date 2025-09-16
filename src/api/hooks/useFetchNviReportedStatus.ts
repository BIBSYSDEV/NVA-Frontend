import { useQuery } from '@tanstack/react-query';
import { fetchNviReportStatusForRegistration } from '../scientificIndexApi';

interface QueryOptions {
  enabled?: boolean;
}

export const useFetchNviReportedStatus = (registrationId: string, { enabled = !!registrationId }: QueryOptions) => {
  return useQuery({
    enabled: !!registrationId && enabled,
    queryKey: ['nviReportStatus', registrationId],
    queryFn: () => fetchNviReportStatusForRegistration(registrationId),
    retry: false,
    meta: { errorMessage: false },
  });
};
