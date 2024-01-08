import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { fetchRegistrationsExport } from '../../api/searchApi';
import { setNotification } from '../../redux/notificationSlice';

interface ExportResultsButtonProps {
  searchParams: URLSearchParams;
}

export const ExportResultsButton = ({ searchParams }: ExportResultsButtonProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isLoadingExport, setIsLoadingExport] = useState(false);

  return (
    <LoadingButton
      variant="outlined"
      startIcon={<FileDownloadIcon />}
      loadingPosition="start"
      loading={isLoadingExport}
      onClick={async () => {
        setIsLoadingExport(true);
        try {
          const fetchExportData = await fetchRegistrationsExport(searchParams);
          // Force UTF-8 for excel with '\uFEFF': https://stackoverflow.com/a/42466254
          const blob = new Blob(['\uFEFF', fetchExportData], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = 'result-export.csv';
          link.href = url;
          link.click();
        } catch {
          dispatch(setNotification({ message: t('feedback.error.get_registrations_export'), variant: 'error' }));
        } finally {
          setIsLoadingExport(false);
        }
      }}>
      {t('search.export')}
    </LoadingButton>
  );
};
