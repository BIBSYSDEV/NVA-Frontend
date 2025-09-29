import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchNviReportExport } from '../../../api/hooks/useFetchNviReportExport';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

export const ExportNviStatusButton = () => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const fetchNviApprovalReportQuery = useFetchNviReportExport(year);

  return (
    <Button
      data-testid={dataTestId.common.exportButton}
      color="tertiary"
      variant="contained"
      startIcon={<FileDownloadOutlinedIcon />}
      loadingPosition="start"
      onClick={() => fetchNviApprovalReportQuery.refetch()}
      loading={fetchNviApprovalReportQuery.isFetching}>
      {t('search.export')}
    </Button>
  );
};
