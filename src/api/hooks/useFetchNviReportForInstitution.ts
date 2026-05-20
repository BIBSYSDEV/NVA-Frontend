import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchNviReportForInstitution } from '../scientificIndexApi';

interface QueryOptions {
  id: string;
  year: number;
  enabled?: boolean;
}

export const useFetchNviReportForInstitution = ({ id, year, enabled = true }: QueryOptions) => {
  const { t } = useTranslation();
  const isValidYear = Number.isInteger(year) && year >= 1000 && year <= 9999;

  return useQuery({
    enabled: !!id && !!year && isValidYear && enabled,
    queryKey: ['nviReportInstitution', id, year],
    queryFn: () => fetchNviReportForInstitution(id, year),
    meta: { errorMessage: t('feedback.error.get_nvi_report_for_institution') },
  });
};
