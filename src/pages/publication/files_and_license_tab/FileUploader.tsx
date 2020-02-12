import React, { useEffect } from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import { Dashboard } from '@uppy/react';
import { useTranslation } from 'react-i18next';
import { File, UppyFileResponse, emptyFile } from '../../../types/file.types';

interface FileUploaderProps {
  addFile: (file: File) => void;
  uppy: any;
}

const uploaderMaxWidthPx = 10000;
const uploaderMaxHeightPx = 200;

const FileUploader: React.FC<FileUploaderProps> = ({ addFile, uppy }) => {
  const { t } = useTranslation('publication');

  useEffect(() => {
    if (uppy && !uppy.hasUploadSuccessEventListener) {
      uppy.on('upload-success', (file: File, response: UppyFileResponse) => {
        addFile({
          ...emptyFile,
          ...file,
          uploadUrl: response?.uploadURL,
        });
      });
      // Avoid duplicating event listener
      uppy.hasUploadSuccessEventListener = true;
    }
  }, [addFile, uppy]);

  return uppy ? (
    <Dashboard
      uppy={uppy}
      proudlyDisplayPoweredByUppy={false}
      showSelectedFiles={false}
      showProgressDetails
      hideProgressAfterFinish
      width={uploaderMaxWidthPx}
      height={uploaderMaxHeightPx}
      locale={{
        strings: {
          dropPaste: `${t('files_and_license.drag_files')} %{browse}`,
          browse: t('files_and_license.browse'),
        },
      }}
    />
  ) : null;
};

export default FileUploader;
