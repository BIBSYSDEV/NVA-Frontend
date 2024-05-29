import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Organization } from '../../types/organization.types';
import { fetchResource } from '../commonApi';

export const useFetchOrganization = (organizationId = '') => {
  const { t } = useTranslation();

  const organizationQuery = useQuery({
    queryKey: ['organization', organizationId],
    enabled: !!organizationId,
    queryFn: organizationId ? () => fetchResource<Organization>(organizationId) : undefined,
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
    meta: { errorMessage: t('feedback.error.get_institution') },
  });
  return organizationQuery;
};
