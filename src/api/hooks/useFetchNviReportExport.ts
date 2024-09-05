import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchNviInstitutionApprovalReport } from '../scientificIndexApi';

export const useFetchNviReportExport = (
  year: number,
  fetchReport: boolean,
  setFetchReport: (value: boolean) => void
) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: fetchReport && !!year,
    queryKey: ['nvi-report', year],
    queryFn: () => {
      try {
        return fetchNviInstitutionApprovalReport(year);
      } finally {
        setFetchReport(false);
      }
    },
    meta: { errorMessage: t('feedback.error.get_nvi_status_export') },
  });
};
