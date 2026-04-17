import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useExportNviPublicationPointsMutation } from '../../../api/hooks/useExportNviPublicationPointsMutation';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

interface ExportNviStatusButtonProps {
  acronym?: string;
  exportAllInstitutions?: boolean;
}

export const ExportNviPublicationPointsButton = ({
  acronym,
  exportAllInstitutions = false,
}: ExportNviStatusButtonProps) => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const user = useSelector((store: RootState) => store.user);
  const userTopLevelOrg = user?.topOrgCristinId ?? '';
  const institutionId = getIdentifierFromId(userTopLevelOrg);
  const dispatch = useDispatch();
  const exportMutation = useExportNviPublicationPointsMutation();
  const isPending = exportMutation.isPending;

  const handleClick = async () => {
    if (isPending) {
      return;
    }

    try {
      const blob = exportAllInstitutions
        ? await exportMutation.mutateAsync({ year })
        : await exportMutation.mutateAsync({ year, institutionId });

      const url = URL.createObjectURL(blob);

      const fileName = exportAllInstitutions
        ? `nvi-publication-points-${year}.csv`
        : `nvi-publication-points-${acronym}-${year}.csv`;

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
    <Button
      data-testid={dataTestId.common.exportButton}
      color="tertiary"
      variant="contained"
      startIcon={<FileDownloadOutlinedIcon />}
      loadingPosition="start"
      onClick={handleClick}
      loading={isPending}>
      {t('search.export')}
    </Button>
  );
};
