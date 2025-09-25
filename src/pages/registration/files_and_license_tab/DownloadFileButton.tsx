import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadImportCandidateFile, downloadRegistrationFile } from '../../../api/fileApi';
import { AssociatedFile } from '../../../types/associatedArtifact.types';
import { Registration } from '../../../types/registration.types';
import { openFileInNewTab } from '../../../utils/registration-helpers';

interface DownloadFileButtonProps {
  file: AssociatedFile;
  registration: Registration;
}

export const DownloadFileButton = ({ file, registration }: DownloadFileButtonProps) => {
  const { t } = useTranslation();

  const [downloadFile, setDownloadFile] = useState(false);

  const downloadFileQuery = useQuery({
    enabled: downloadFile,
    queryKey: ['downloadFile', registration.type, registration.identifier, file.identifier],
    queryFn: async () => {
      const downloadFileResponse =
        registration.type === 'Publication'
          ? await downloadRegistrationFile(registration.identifier, file.identifier)
          : await downloadImportCandidateFile(registration.identifier, file.identifier);
      if (downloadFileResponse.id) {
        openFileInNewTab(downloadFileResponse.id);
      }
      setDownloadFile(false); // Ensure that a new URL is obtained every time, due to expiration
      return downloadFileResponse;
    },
    meta: { errorMessage: t('feedback.error.download_file') },
    gcTime: 0,
  });

  return downloadFileQuery.isFetching ? (
    <CircularProgress size="1.5rem" sx={{ m: '0.3rem' }} />
  ) : (
    <Tooltip title={t('registration.files_and_license.open_file')}>
      <IconButton size="small" onClick={() => setDownloadFile(true)}>
        <OpenInNewOutlinedIcon color="primary" />
      </IconButton>
    </Tooltip>
  );
};
