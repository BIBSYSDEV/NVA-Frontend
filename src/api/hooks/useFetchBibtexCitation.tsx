import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchBibtexCitation } from '../searchApi';

/**
 * Fetches the BibTeX reference for a single publication.
 */
export const useFetchBibtexCitation = (identifier: string, enabled: boolean) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['bibtex-citation', identifier],
    enabled: enabled && !!identifier,
    queryFn: ({ signal }) => fetchBibtexCitation(identifier, signal),
    staleTime: Infinity,
    meta: { errorMessage: t('feedback.error.get_reference') },
  });
};
