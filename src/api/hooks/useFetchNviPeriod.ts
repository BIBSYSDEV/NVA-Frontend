import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchNviPeriod } from '../scientificIndexApi';

export const useFetchNviPeriod = (year: number) => {
  const { t } = useTranslation();

  const nviPeriodQuery = useQuery({
    queryKey: ['nviPeriods', year],
    enabled: !!year,
    queryFn: () => fetchNviPeriod(year),
    meta: { errorMessage: t('feedback.error.get_nvi_period') },
  });

  return nviPeriodQuery;
};
