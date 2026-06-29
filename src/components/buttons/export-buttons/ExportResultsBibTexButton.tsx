import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FetchResultsParams } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { bibtexExportFormat } from '../../../utils/export/exportFormats';
import { useResultsExport } from '../../../utils/export/useResultsExport';
import { ProgressDialog } from '../../dialogs/progress-dialog/ProgressDialog';

interface ExportResultsBibTexButtonProps {
  params: FetchResultsParams;
}

export const ExportResultsBibTexButton = ({ params }: ExportResultsBibTexButtonProps) => {
  const { t } = useTranslation();
  const { exportResults, cancelExport, isExporting, progress } = useResultsExport(params);

  return (
    <>
      <Button
        data-testid={dataTestId.common.exportBibTexButton}
        color="tertiary"
        variant="contained"
        startIcon={<FileDownloadOutlinedIcon />}
        loadingPosition="start"
        onClick={() => exportResults(bibtexExportFormat)}
        loading={isExporting}>
        {t('search.export')}
      </Button>
      <ProgressDialog open={isExporting} onCancel={cancelExport} {...progress} />
    </>
  );
};
