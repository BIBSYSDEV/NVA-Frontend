import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { OrganizationSearchParams, searchForOrganizations } from '../cristinApi';

export const useSearchForOrganizations = (searchTerm: string) => {
  const { t } = useTranslation();

  const organizationQueryParams: OrganizationSearchParams = {
    query: searchTerm,
    includeSubunits: true,
  };
  return useQuery({
    enabled: !!searchTerm,
    queryKey: ['organization', organizationQueryParams],
    queryFn: () => searchForOrganizations(organizationQueryParams),
    meta: { errorMessage: t('feedback.error.get_institutions') },
  });
};
