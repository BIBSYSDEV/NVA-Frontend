import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Button, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';

// NOTE: This is only used as a placeholder while the endpoint for reporting status is not implemented
export const ExportNviStatusButton = () => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t('export_nvi_status_button_tooltip_text')}>
      {/* HACK: Tooltip will not render if the direct child is disabled */}
      <span>
        <Button
          disabled
          data-testid={dataTestId.common.exportButton}
          color="tertiary"
          variant="contained"
          startIcon={<FileDownloadOutlinedIcon />}>
          {t('search.export')}
        </Button>
      </span>
    </Tooltip>
  );
};
