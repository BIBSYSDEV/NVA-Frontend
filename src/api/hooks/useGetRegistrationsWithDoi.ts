import { useQuery } from '@tanstack/react-query';
import { fetchResults } from '../searchApi';

export const useGetRegistrationsWithDoi = (doiQuery: string) => {
  return useQuery({
    enabled: !!doiQuery,
    queryKey: ['doi-results', doiQuery],
    queryFn: () => fetchResults({ doi: doiQuery }),
  });
};
