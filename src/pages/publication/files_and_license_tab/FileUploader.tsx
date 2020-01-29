import React, { useEffect } from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import { Dashboard } from '@uppy/react';
import { useTranslation } from 'react-i18next';
import { File, emptyFile } from '../../../types/license.types';

interface FileUploaderProps {
  addFile: (file: File) => void;
  uppy: any;
}

const uploaderMaxWidthPx = 10000;
const uploaderMaxHeightPx = 200;
let listenerAdded = false; // Avoid adding upload-success listener multiple times

const FileUploader: React.FC<FileUploaderProps> = ({ addFile, uppy }) => {
  const { t } = useTranslation('publication');

  useEffect(() => {
    if (uppy && !listenerAdded) {
      uppy.on('upload-success', (file: File, response: any) => {
        addFile({
          ...emptyFile,
          ...file,
          uploadUrl: response?.uploadURL,
        });
      });
      listenerAdded = true;
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
