import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchResults, FetchResultsParams } from '../searchApi';

export const useDuplicateTitleSearch = (title: string) => {
  const { t } = useTranslation();

  const searchConfig: FetchResultsParams = {
    title: title,
  };

  return useQuery({
    queryKey: ['registrations', searchConfig],
    queryFn: () => fetchResults(searchConfig),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });
};
