import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchApproval } from '../approvalApi';

export const useFetchApproval = (identifier = '') => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!identifier,
    queryKey: ['approval', identifier],
    queryFn: () => fetchApproval(identifier),
    meta: { errorMessage: t('feedback.error.get_approval') },
  });
};
