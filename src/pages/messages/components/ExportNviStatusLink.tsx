import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { CircularProgress, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useExportNviAuthorSharesMutation } from '../../../api/hooks/useExportNviAuthorSharesMutation';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

interface ExportNviStatusLinkProps {
  acronym?: string;
  isOnAdminPage?: boolean;
}

export const ExportNviStatusLink = ({ acronym, isOnAdminPage }: ExportNviStatusLinkProps) => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);
  const userTopLevelOrg = user?.topOrgCristinId ?? '';
  const institutionId = getIdentifierFromId(userTopLevelOrg);
  const exportMutation = useExportNviAuthorSharesMutation();
  const isPending = exportMutation.isPending;

  const handleClick = async () => {
    if (isPending) {
      return;
    }

    try {
      const blob = isOnAdminPage
        ? await exportMutation.mutateAsync({ year })
        : await exportMutation.mutateAsync({ year, institutionId });

      const url = URL.createObjectURL(blob);

      const fileName = acronym ? `nvi-status-${acronym}-${year}.xlsx` : `nvi-status-${year}.xlsx`;

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('feedback.error.generate_nvi_report');
      dispatch(
        setNotification({
          message,
          variant: 'error',
        })
      );
    }
  };

  return (
    <Link
      component="button"
      type="button"
      data-testid={dataTestId.common.exportLink}
      onClick={handleClick}
      disabled={isPending}
      sx={{
        pl: '0.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        cursor: isPending ? 'default' : 'pointer',
      }}>
      {isPending ? <CircularProgress size={15} /> : <FileDownloadOutlinedIcon fontSize="small" />}
      {t('export_dataset_for_nvi_report')}
    </Link>
  );
};
