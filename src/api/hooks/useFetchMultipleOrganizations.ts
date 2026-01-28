import { useQueries } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../cristinApi';

export const useFetchMultipleOrganizations = (ids: string[], enabled = true) => {
  const { t } = useTranslation();

  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ['organization', id],
      queryFn: () => fetchOrganization(id),
      enabled: !!id && enabled,
      staleTime: Infinity,
      gcTime: 1_800_000,
      meta: { errorMessage: t('feedback.error.get_institution') },
    })),
  });
};
