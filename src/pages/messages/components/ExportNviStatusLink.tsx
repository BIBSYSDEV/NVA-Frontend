import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { CircularProgress, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchNviReportExport } from '../../../api/hooks/useFetchNviReportExport';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

interface ExportNviStatusLinkProps {
  acronym?: string;
}
export const ExportNviStatusLink = ({ acronym = '' }: ExportNviStatusLinkProps) => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const fetchNviApprovalReportQuery = useFetchNviReportExport(year, acronym);
  const isFetching = fetchNviApprovalReportQuery.isFetching;

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
      disabled={isFetching}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        cursor: isFetching ? 'default' : 'pointer',
      }}>
      {isFetching ? <CircularProgress size={15} /> : <FileDownloadOutlinedIcon fontSize="small" />}
      {t('export_dataset_for_nvi_report')}
    </Link>
  );
};
