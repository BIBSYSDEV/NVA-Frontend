import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchNviPeriodReport } from '../scientificIndexApi';

interface QueryOptions {
  year: number;
  enabled?: boolean;
}

export const useFetchNviPeriodReport = ({ year, enabled = true }: QueryOptions) => {
  const { t } = useTranslation();
  const isValidYear = Number.isInteger(year) && year >= 1000 && year <= 9999;

  return useQuery({
    enabled: !!year && isValidYear && enabled,
    queryKey: ['nviReportInstitution', year],
    queryFn: () => fetchNviPeriodReport(year),
    meta: { errorMessage: t('feedback.error.get_nvi_period_report') },
  });
};
