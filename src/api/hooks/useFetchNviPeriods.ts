import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchNviPeriods } from '../scientificIndexApi';

export const useFetchNviPeriods = () => {
  const { t } = useTranslation();

  const nviPeriodsQuery = useQuery({
    queryKey: ['nviPeriods'],
    queryFn: fetchNviPeriods,
    meta: { errorMessage: t('feedback.error.get_nvi_periods') },
  });
  return nviPeriodsQuery;
};
