import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useBibtexExport } from '../../../utils/bibtex/useBibtexExport';
import { dataTestId } from '../../../utils/dataTestIds';

interface ExportResultsBibTexButtonProps {
  searchParams: URLSearchParams;
}

export const ExportResultsBibTexButton = ({ searchParams }: ExportResultsBibTexButtonProps) => {
  const { t } = useTranslation();
  const { exportBibTex, isFetchingBibtex } = useBibtexExport(searchParams);

  return (
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
  );
};
