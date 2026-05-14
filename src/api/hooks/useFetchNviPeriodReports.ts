import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchAllNviPeriodReports } from '../scientificIndexApi';

export const useFetchNviPeriodReports = () => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['nviReports'],
    queryFn: fetchAllNviPeriodReports,
    meta: { errorMessage: t('feedback.error.get_nvi_periods') },
  });
};
