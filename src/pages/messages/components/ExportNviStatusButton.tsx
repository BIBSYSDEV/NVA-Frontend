import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchNviReportExport } from '../../../api/hooks/useFetchNviReportExport';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { Organization } from '../../../types/organization.types';

interface ExportNviStatusButtonProps {
  organization: Organization | undefined;
}

export const ExportNviStatusButton = ({ organization }: ExportNviStatusButtonProps) => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const fetchNviApprovalReportQuery = useFetchNviReportExport(year, organization?.acronym || '');

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
