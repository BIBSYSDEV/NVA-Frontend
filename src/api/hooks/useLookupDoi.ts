import { useQuery } from '@tanstack/react-query';
import { fetchResults } from '../searchApi';
import { useCreateDoiPreview } from './useCreateDoiPreview';

export const useLookupDoi = (doiQuery: string) => {
  const doiPreviewMutation = useCreateDoiPreview();

  const registrationSearch = useQuery({
    enabled: !!doiQuery,
    queryKey: ['doi-results', doiQuery],
    queryFn: async () => {
      const results = await fetchResults({ doi: doiQuery });
      if (results.hits.length === 0) {
        doiPreviewMutation.mutate(doiQuery);
      }
      return results;
    },
  });

  const registrationsWithDoi = registrationSearch.data?.hits ?? [];
  const isLookingUpDoi = registrationSearch.isFetching || doiPreviewMutation.isPending;
  const noHits = registrationSearch.isFetched && registrationsWithDoi.length === 0 && doiPreviewMutation.isError;
  const doiPreview = doiPreviewMutation.isSuccess && doiPreviewMutation.data ? doiPreviewMutation.data : null;

  return {
    registrationsWithDoi,
    isLookingUpDoi,
    noHits,
    doiPreview,
    doiPreviewMutationQuery: doiPreviewMutation,
    registrationSearchQuery: registrationSearch,
  };
};
