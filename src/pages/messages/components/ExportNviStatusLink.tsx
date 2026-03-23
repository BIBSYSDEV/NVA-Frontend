import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchNviReportExport } from '../../../api/hooks/useFetchNviReportExport';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

interface ExportNviStatusButtonProps {
  acronym: string;
}
export const ExportNviStatusLink = ({ acronym }: ExportNviStatusButtonProps) => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const fetchNviApprovalReportQuery = useFetchNviReportExport(year, acronym);

  const handleClick = () => {
    if (!fetchNviApprovalReportQuery.isFetching) {
      fetchNviApprovalReportQuery.refetch();
    }
  };

  return (
    <Link
      component="button"
      type="button"
      data-testid={dataTestId.common.exportLink}
      color="tertiary"
      onClick={handleClick}
      disabled={fetchNviApprovalReportQuery.isFetching}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        opacity: fetchNviApprovalReportQuery.isFetching ? 0.7 : 1,
        cursor: fetchNviApprovalReportQuery.isFetching ? 'default' : 'pointer',
      }}>
      <FileDownloadOutlinedIcon fontSize="small" />
      {t('export_dataset_for_nvi_report')}
    </Link>
  );
};
