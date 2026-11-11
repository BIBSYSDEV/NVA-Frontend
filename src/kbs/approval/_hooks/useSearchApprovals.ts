import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { searchApprovals } from '../_api/approvalApi';

export const useSearchApprovals = (query: string) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: query.length > 0,
    queryKey: ['approvalSearch', query],
    queryFn: ({ signal }) => searchApprovals(query, signal),
    meta: { errorMessage: t('could_not_search_approvals') },
  });
};
