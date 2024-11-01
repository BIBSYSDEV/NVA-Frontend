import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { OrganizationSearchParams, searchForOrganizations } from '../cristinApi';

export const useSearchForOrganizations = (params: OrganizationSearchParams) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!params.query,
    queryKey: ['organization', params],
    queryFn: () => searchForOrganizations(params),
    meta: { errorMessage: t('feedback.error.get_institutions') },
    placeholderData: keepPreviousData,
  });
};
