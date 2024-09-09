import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchNviReportExport } from '../../../api/hooks/useFetchNviReportExport';
import { dataTestId } from '../../../utils/dataTestIds';
import { triggerFileDownload } from '../../../utils/downloadFileHelpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

export const ExportNviStatusButton = () => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();

  const { fetchExportQuery, setFetchReport } = useFetchNviReportExport(year);

  useEffect(() => {
    if (fetchExportQuery.data) {
      triggerFileDownload(fetchExportQuery.data, `nvi_report_${year}.xlsx`);
    }
  }, [year, fetchExportQuery.data]);

  return (
    <LoadingButton
      data-testid={dataTestId.common.exportButton}
      variant="outlined"
      startIcon={<FileDownloadOutlinedIcon />}
      onClick={() => setFetchReport(true)}
      loading={fetchExportQuery.isFetching}>
      {t('search.export')}
    </LoadingButton>
  );
};
