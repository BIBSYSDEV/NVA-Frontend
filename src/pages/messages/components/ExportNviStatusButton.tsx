import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchNviReportExport } from '../../../api/hooks/useFetchNviReportExport';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

export const ExportNviStatusButton = () => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const [fetchReport, setFetchReport] = useState(false);

  const fetchNviApprovalReportQuery = useFetchNviReportExport(year, fetchReport, setFetchReport);

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
      data-testid={dataTestId.common.exportButton}
      variant="outlined"
      startIcon={<FileDownloadOutlinedIcon />}
      onClick={() => setFetchReport(true)}
      loading={fetchNviApprovalReportQuery.isFetching}>
      {t('search.export')}
    </LoadingButton>
  );
};
