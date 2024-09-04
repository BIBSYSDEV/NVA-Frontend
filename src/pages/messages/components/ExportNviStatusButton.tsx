import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { LoadingButton } from '@mui/lab';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchNviInstitutionApprovalReport } from '../../../api/scientificIndexApi';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

export const ExportNviStatusButton = () => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const [fetchReport, setFetchReport] = useState(false);

  const fetchNviApprovalReportQuery = useQuery({
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

  useEffect(() => {
    if (fetchNviApprovalReportQuery.data) {
      const url = window.URL.createObjectURL(fetchNviApprovalReportQuery.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `nvi_report_${year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }, [year, fetchNviApprovalReportQuery.data]);

  return (
    <LoadingButton
      variant="outlined"
      startIcon={<FileDownloadOutlinedIcon />}
      onClick={() => setFetchReport(true)}
      loading={fetchNviApprovalReportQuery.isFetching}>
      {t('search.export')}
    </LoadingButton>
  );
};
