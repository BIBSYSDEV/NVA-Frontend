import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { findApprovalWithIdentifier } from '../../utils/approval-helpers';
import { searchApprovals } from '../approvalApi';

/** Finds the approval with the given identifier value, such as a DMP number */
export const useFetchApprovalByIdentifier = (identifier = '') => {
  const { t } = useTranslation();

  return useQuery({
    enabled: identifier.length > 0,
    queryKey: ['approvalByIdentifier', identifier],
    queryFn: async ({ signal }) => {
      const searchResponse = await searchApprovals(identifier, signal);
      return findApprovalWithIdentifier(searchResponse.hits, identifier);
    },
    meta: { errorMessage: t('feedback.error.search') },
  });
};
