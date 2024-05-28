import { useQuery } from '@tanstack/react-query';
import { FetcNviCandidatesParams, fetchNviAggregations } from '../searchApi';

export const useFetchNviCandidates = () => {
  const nviQueryParams: FetcNviCandidatesParams = {
    aggregation: 'all',
    size: 1,
  };

  const nviQuery = useQuery({
    queryKey: ['nviCandidates', nviQueryParams],
    queryFn: () => fetchNviAggregations(nviQueryParams),
  });

  return nviQuery;
};
