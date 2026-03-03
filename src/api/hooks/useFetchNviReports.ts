import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchNviReportsAllInstitutions } from '../scientificIndexApi';

interface QueryOptions {
  year: string;
  enabled?: boolean;
}

export const useFetchNviReports = ({ year, enabled = true }: QueryOptions) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!year && enabled,
    queryKey: ['nviReports', year],
    queryFn: () => fetchNviReportsAllInstitutions(year),
    meta: { errorMessage: t('feedback.error.get_nvi_reports') },
  });
};
