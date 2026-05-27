import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FetchResultsParams } from '../../../api/searchApi';
import { useBibtexExport } from '../../../utils/bibtex/useBibtexExport';
import { dataTestId } from '../../../utils/dataTestIds';
import { BibtexExportProgressDialog } from '../../dialogs/BibtexExportProgressDialog';

interface ExportResultsBibTexButtonProps {
  params: FetchResultsParams;
}

export const ExportResultsBibTexButton = ({ params }: ExportResultsBibTexButtonProps) => {
  const { t } = useTranslation();
  const { exportBibTex, isFetchingBibtex, fetchedCount, totalCount } = useBibtexExport(params);

  return (
    <>
      <Button
        data-testid={dataTestId.common.exportBibTexButton}
        color="tertiary"
        variant="contained"
        startIcon={<FileDownloadOutlinedIcon />}
        loadingPosition="start"
        onClick={() => exportBibTex()}
        loading={isFetchingBibtex}>
        {t('search.export')}
      </Button>
      <BibtexExportProgressDialog open={isFetchingBibtex} fetchedCount={fetchedCount} totalCount={totalCount} />
    </>
  );
};
