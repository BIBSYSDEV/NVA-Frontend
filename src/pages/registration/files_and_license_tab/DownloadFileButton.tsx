import AttachFileIcon from '@mui/icons-material/AttachFile';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadPrivateFile2 } from '../../../api/fileApi';
import { AssociatedFile } from '../../../types/associatedArtifact.types';
import { Registration } from '../../../types/registration.types';
import { openFileInNewTab } from '../../../utils/registration-helpers';

interface DownloadFileButtonProps {
  file: AssociatedFile;
}

export const DownloadFileButton = ({ file }: DownloadFileButtonProps) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<Registration>();

  const [downloadFile, setDownloadFile] = useState(false);

  const downloadFileQuery = useQuery({
    enabled: downloadFile,
    queryKey: ['downloadFile', values.identifier, file.identifier],
    queryFn: async () => {
      const downloadFileResponse = await downloadPrivateFile2(values.identifier, file.identifier);
      if (downloadFileResponse?.id) {
        openFileInNewTab(downloadFileResponse.id);
      }
      setDownloadFile(false); // Ensure that a new URL is obtained every time, due to expiration
      return downloadFileResponse;
    },
    meta: { errorMessage: t('feedback.error.download_file') },
    cacheTime: 0,
  });

  return downloadFileQuery.isFetching ? (
    <CircularProgress size="1.5rem" />
  ) : (
    <Tooltip title={t('registration.files_and_license.open_file')}>
      <IconButton size="small" onClick={() => setDownloadFile(true)}>
        <AttachFileIcon color="primary" />
      </IconButton>
    </Tooltip>
  );
};
