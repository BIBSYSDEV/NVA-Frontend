import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../utils/constants';
import { SearchApiPath } from '../../api/apiPaths';
import { Button } from '@mui/material';
import { dataTestId } from '../../utils/dataTestIds';
import { useEffect, useState } from 'react';

interface ExportResultsButtonProps {
  searchParams: URLSearchParams;
}

export const ExportResultsButton = ({ searchParams }: ExportResultsButtonProps) => {
  const { t } = useTranslation();
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => setIsClicked(false), [searchParams]);

  return (
    <Button
      href={`${API_URL.slice(0, -1)}${SearchApiPath.RegistrationsExport}?${searchParams.toString()}`}
      onClick={() => setIsClicked(true)}
      title={t('search.export')}
      data-testid={dataTestId.startPage.advancedSearch.downloadResultsButton}
      variant="outlined"
      disabled={isClicked}
      download>
      <FileDownloadOutlinedIcon />
    </Button>
  );
};
