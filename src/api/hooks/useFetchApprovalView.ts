import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchApprovalView } from '../approvalApi';

export const useFetchApprovalView = (identifier = '') => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!identifier,
    queryKey: ['approvalView', identifier],
    queryFn: () => fetchApprovalView(identifier),
    meta: { errorMessage: t('feedback.error.get_approval') },
  });
};
