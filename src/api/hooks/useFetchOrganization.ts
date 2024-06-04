import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../cristinApi';

export const useFetchOrganization = (unitUri: string) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!unitUri,
    queryKey: ['organization', unitUri],
    queryFn: () => fetchOrganization(unitUri),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
  });
};
