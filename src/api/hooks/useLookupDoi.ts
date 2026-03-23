import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchResults } from '../searchApi';
import { useCreateDoiPreview } from './useCreateDoiPreview';

export const useLookupDoi = (doiQuery: string) => {
  const doiPreviewMutation = useCreateDoiPreview();

  const registrationSearch = useQuery({
    enabled: !!doiQuery,
    queryKey: ['doi-results', doiQuery],
    queryFn: async () => {
      return fetchResults({ doi: doiQuery });
    },
  });

  useEffect(() => {
    if (!doiQuery) return;
    if (!registrationSearch.data) return;

    const hits = registrationSearch.data.hits ?? [];

    if (hits.length === 0 && !doiPreviewMutation.isPending && !doiPreviewMutation.isSuccess) {
      doiPreviewMutation.mutate(doiQuery);
    }
  }, [
    doiQuery,
    registrationSearch.data,
    doiPreviewMutation.isPending,
    doiPreviewMutation.isSuccess,
    doiPreviewMutation,
  ]);

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
