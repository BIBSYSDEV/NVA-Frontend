import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetchResults } from '../searchApi';
import { useCreateDoiPreview } from './useCreateDoiPreview';

export const useLookupDoi = (doiQuery: string) => {
  const doiPreviewMutation = useCreateDoiPreview();

  const [lastMutatedDoi, setLastMutatedDoi] = useState<string | null>(null);

  const registrationSearch = useQuery({
    enabled: !!doiQuery,
    queryKey: ['doi-results', doiQuery],
    queryFn: async () => fetchResults({ doi: doiQuery }),
  });

  useEffect(() => {
    if (!doiQuery) return;
    if (!registrationSearch.data) return;

    const hits = registrationSearch.data.hits ?? [];

    const isNewDoi = lastMutatedDoi !== doiQuery;

    if (hits.length === 0 && isNewDoi && !doiPreviewMutation.isPending) {
      doiPreviewMutation.mutate(doiQuery, {
        onSuccess: () => {
          setLastMutatedDoi(doiQuery);
        },
      });
    }
  }, [
    doiQuery,
    registrationSearch.data,
    doiPreviewMutation.isPending,
    doiPreviewMutation, // stable reference
    lastMutatedDoi,
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
