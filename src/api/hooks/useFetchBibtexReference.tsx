import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchBibtexReference } from '../searchApi';

/**
 * Fetches the BibTeX reference for a single publication.
 */
export const useFetchBibtexReference = (identifier: string, enabled: boolean) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['bibtex-citation', identifier],
    enabled: enabled && !!identifier,
    queryFn: ({ signal }) => fetchBibtexReference(identifier, signal),
    staleTime: Infinity,
    meta: { errorMessage: t('feedback.error.get_reference') },
  });
};
