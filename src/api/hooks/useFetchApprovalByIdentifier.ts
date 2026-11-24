import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { NewProjectApproval } from '../../types/project.types';
import { getApprovalIdentifier } from '../../utils/approval-helpers';
import { searchApprovalsByIdentifier } from '../approvalApi';

/** Finds the approval in the approval API that a project approval was created from */
export const useFetchApprovalByIdentifier = (
  projectApproval?: Pick<NewProjectApproval, 'authority' | 'identifier'>
) => {
  const { t } = useTranslation();
  const approvalIdentifier = projectApproval ? getApprovalIdentifier(projectApproval) : null;

  return useQuery({
    enabled: !!approvalIdentifier,
    queryKey: ['approvalByIdentifier', approvalIdentifier],
    queryFn: async ({ signal }) => {
      if (!approvalIdentifier) {
        return null;
      }
      const searchResponse = await searchApprovalsByIdentifier(approvalIdentifier, signal);
      // NOTE: The identifier search only returns exact matches
      return searchResponse.hits[0] ?? null;
    },
    meta: { errorMessage: t('feedback.error.search') },
  });
};
