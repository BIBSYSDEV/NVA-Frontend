import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { triggerFileDownload } from '../../utils/downloadFileHelpers';
import { fetchNviInstitutionApprovalReport } from '../scientificIndexApi';

export const useFetchNviReportExport = (year: number) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: false, // Report can only be created on demand, with .refetch()
    queryKey: ['nvi-report', year],
    queryFn: async () => {
      const data = await fetchNviInstitutionApprovalReport(year);
      triggerFileDownload(data, `nvi_report_${year}.xlsx`);
      return data;
    },
    meta: { errorMessage: t('feedback.error.get_nvi_status_export') },
  });
};
