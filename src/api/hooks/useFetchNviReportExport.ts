import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { triggerFileDownload } from '../../utils/downloadFileHelpers';
import { fetchNviInstitutionApprovalReport } from '../scientificIndexApi';

export const useFetchNviReportExport = (year: number, orgAcronym: string) => {
  const { t } = useTranslation();
  const date = new Date()
    .toLocaleString('no-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace('_', ':')
    .replace(', ', '_');

  return useQuery({
    enabled: false, // Report can only be created on demand, with .refetch()
    queryKey: ['nvi-report', year, orgAcronym, date],
    queryFn: async () => {
      const data = await fetchNviInstitutionApprovalReport(year);
      triggerFileDownload(data, `${orgAcronym}_nvi_report_period_${year}_exported_on_${date}.xlsx`);
      return data;
    },
    meta: { errorMessage: t('feedback.error.get_nvi_status_export') },
  });
};
