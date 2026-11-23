import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { searchApprovalsByQuery } from '../approvalApi';

const minimumQueryLength = 2;

export const useSearchApprovals = (query: string) => {
  const { t } = useTranslation();
  const isQueryLongEnough = query.length >= minimumQueryLength;

  return useQuery({
    enabled: isQueryLongEnough,
    queryKey: ['approvalSearch', query],
    queryFn: ({ signal }) => searchApprovalsByQuery(query, signal),
    meta: { errorMessage: t('feedback.error.search') },
    // NOTE: Keep showing the previous results while searching, but not after the query is cleared or too short
    placeholderData: (previousData) => (isQueryLongEnough ? previousData : undefined),
  });
};
