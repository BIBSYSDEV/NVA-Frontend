import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { OrganizationSearchParams, searchForOrganizations } from '../cristinApi';

export const useSearchForOrganizations = (params: OrganizationSearchParams) => {
  const { t } = useTranslation();

  const organizationQueryParams: OrganizationSearchParams = {
    ...params,
    includeSubunits: true,
  };
  return useQuery({
    enabled: !!organizationQueryParams.query,
    queryKey: ['organization', organizationQueryParams],
    queryFn: () => searchForOrganizations(organizationQueryParams),
    meta: { errorMessage: t('feedback.error.get_institutions') },
    placeholderData: keepPreviousData,
  });
};
