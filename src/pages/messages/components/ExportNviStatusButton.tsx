import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { useFetchNviReportExport } from '../../../api/hooks/useFetchNviReportExport';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

export const ExportNviStatusButton = () => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const fetchNviApprovalReportQuery = useFetchNviReportExport(year);

  return (
    <LoadingButton
      data-testid={dataTestId.common.exportButton}
      variant="outlined"
      startIcon={<FileDownloadOutlinedIcon />}
      onClick={() => fetchNviApprovalReportQuery.refetch()}
      loading={fetchNviApprovalReportQuery.isFetching}>
      {t('search.export')}
    </LoadingButton>
  );
};
