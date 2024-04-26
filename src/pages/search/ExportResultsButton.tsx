import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../utils/constants';
import { SearchApiPath } from '../../api/apiPaths';
import { Button } from '@mui/material';
import { dataTestId } from '../../utils/dataTestIds';

interface ExportResultsButtonProps {
  searchParams: URLSearchParams;
}

export const ExportResultsButton = ({ searchParams }: ExportResultsButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      href={`${API_URL.slice(0, -1)}${SearchApiPath.RegistrationsExport}?${searchParams.toString()}`}
      title={t('search.export')}
      data-testid={dataTestId.startPage.advancedSearch.downloadResultsButton}
      variant="outlined"
      download>
      <FileDownloadOutlinedIcon />
    </Button>
  );
};
