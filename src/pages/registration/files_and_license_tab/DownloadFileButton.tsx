import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadImportCandidateFile, downloadPrivateFile2 } from '../../../api/fileApi';
import { AssociatedFile } from '../../../types/associatedArtifact.types';
import { Registration } from '../../../types/registration.types';
import { openFileInNewTab } from '../../../utils/registration-helpers';

interface DownloadFileButtonProps {
  file: AssociatedFile;
  greyTones?: boolean;
}

export const DownloadFileButton = ({ file, greyTones }: DownloadFileButtonProps) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<Registration>();

  const [downloadFile, setDownloadFile] = useState(false);

  const downloadFileQuery = useQuery({
    enabled: downloadFile,
    queryKey: ['downloadFile', values.type, values.identifier, file.identifier],
    queryFn: async () => {
      const downloadFileResponse =
        values.type === 'Publication'
          ? await downloadPrivateFile2(values.identifier, file.identifier)
          : await downloadImportCandidateFile(values.identifier, file.identifier);
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
    <CircularProgress size="1.5rem" />
  ) : (
    <Tooltip title={t('registration.files_and_license.open_file')}>
      <IconButton size="small" style={{ height: '1.5rem', padding: 0 }} onClick={() => setDownloadFile(true)}>
        <OpenInNewOutlinedIcon color="primary" sx={{ color: greyTones ? 'grey.600' : '' }} />
      </IconButton>
    </Tooltip>
  );
};
