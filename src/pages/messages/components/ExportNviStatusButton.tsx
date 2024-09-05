import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchNviReportExport } from '../../../api/hooks/useFetchNviReportExport';
import { dataTestId } from '../../../utils/dataTestIds';
import { triggerFileDownload } from '../../../utils/downloadFileHelpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

export const ExportNviStatusButton = () => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const [fetchReport, setFetchReport] = useState(false);

  const fetchNviApprovalReportQuery = useFetchNviReportExport(year, fetchReport, setFetchReport);

  useEffect(() => {
    if (fetchNviApprovalReportQuery.data) {
      triggerFileDownload(fetchNviApprovalReportQuery.data, `nvi_report_${year}.xlsx`);
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
