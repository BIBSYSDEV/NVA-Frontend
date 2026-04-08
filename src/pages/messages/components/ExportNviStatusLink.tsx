import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { CircularProgress, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useExportNviStatusMutation } from '../../../api/hooks/useExportNviStatusMutation';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

interface ExportNviStatusLinkProps {
  acronym: string;
}

export const ExportNviStatusLink = ({ acronym }: ExportNviStatusLinkProps) => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const user = useSelector((store: RootState) => store.user);
  const userTopLevelOrg = user?.topOrgCristinId ?? '';
  const institutionId = getIdentifierFromId(userTopLevelOrg);
  const dispatch = useDispatch();
  const exportMutation = useExportNviStatusMutation();
  const isFetching = exportMutation.isPending;

  const handleClick = async () => {
    if (isFetching) {
      return;
    }

    try {
      const blob = await exportMutation.mutateAsync({ year, institutionId });

      const url = URL.createObjectURL(blob);

      const fileName = `nvi-status-${acronym}-${year}.xlsx`;

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      dispatch(
        setNotification({ message: exportMutation.error?.message ?? 'Kunne ikke generere rapport', variant: 'error' })
      );
    }
  };

  return (
    <Link
      component="button"
      type="button"
      data-testid={dataTestId.common.exportLink}
      onClick={handleClick}
      disabled={isFetching}
      sx={{
        pl: '0.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        cursor: isFetching ? 'default' : 'pointer',
      }}>
      {isFetching ? <CircularProgress size={15} /> : <FileDownloadOutlinedIcon fontSize="small" />}
      {t('export_dataset_for_nvi_report')}
    </Link>
  );
};
