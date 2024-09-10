import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchNviInstitutionApprovalReport } from '../scientificIndexApi';

export const useFetchNviReportExport = (year: number) => {
  const { t } = useTranslation();
  const [fetchReport, setFetchReport] = useState(false);

  const fetchExportQuery = useQuery({
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

  return { fetchExportQuery, setFetchReport };
};
