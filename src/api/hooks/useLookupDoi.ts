import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetchResults } from '../searchApi';
import { useCreateDoiPreview } from './useCreateDoiPreview';

export const useLookupDoi = () => {
  const doiPreviewMutation = useCreateDoiPreview();

  const [doiQuery, setDoiQuery] = useState('');
  const [lastMutatedDoi, setLastMutatedDoi] = useState<string | null>(null);

  const registrationSearch = useQuery({
    enabled: !!doiQuery,
    queryKey: ['doi-results', doiQuery],
    queryFn: async () => fetchResults({ doi: doiQuery }),
  });

  const { mutate: mutateDoiPreview, reset: resetDoiPreview, isPending } = doiPreviewMutation;

  useEffect(() => {
    if (!doiQuery) return;
    if (!registrationSearch.data) return;

    const hits = registrationSearch.data.hits ?? [];

    const isNewDoi = lastMutatedDoi !== doiQuery;

    if (hits.length === 0 && isNewDoi && !isPending) {
      mutateDoiPreview(doiQuery, {
        onSettled: () => {
          setLastMutatedDoi(doiQuery);
        },
      });
    }
  }, [doiQuery, registrationSearch.data, isPending, mutateDoiPreview, lastMutatedDoi]);

  const lookupDoi = (value: string) => setDoiQuery(value.trim());

  const resetLookup = () => {
    setDoiQuery('');
    resetDoiPreview();
    setLastMutatedDoi(null);
  };

  const registrationsWithDoi = registrationSearch.data?.hits ?? [];
  const isLookingUpDoi = registrationSearch.isFetching || doiPreviewMutation.isPending;

  const noHits = registrationSearch.isFetched && registrationsWithDoi.length === 0 && doiPreviewMutation.isError;

  const doiPreview = doiPreviewMutation.isSuccess && doiPreviewMutation.data ? doiPreviewMutation.data : null;

  return {
    doiQuery,
    registrationsWithDoi,
    isLookingUpDoi,
    noHits,
    doiPreview,
    lookupDoi,
    resetLookup,
    doiPreviewMutationQuery: doiPreviewMutation,
    registrationSearchQuery: registrationSearch,
  };
};
