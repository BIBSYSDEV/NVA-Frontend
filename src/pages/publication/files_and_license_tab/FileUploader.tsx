import React, { useEffect, useState } from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import Tus from '@uppy/tus';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import { useTranslation } from 'react-i18next';
import { emptyFile } from '../../../types/license.types';

const uppy = Uppy({
  autoProceed: true,
}).use(Tus, {
  endpoint: 'https://master.tus.io/files/',
});

interface FileUploaderProps {
  addFile: (file: File) => void;
}

const uploaderMaxWidthPx = 10000;
const uploaderMaxHeightPx = 200;

const FileUploader: React.FC<FileUploaderProps> = ({ addFile }) => {
  const { t } = useTranslation('publication');
  const [listenerAdded, setListenerAdded] = useState(false);

  useEffect(() => {
    // Ups: This will add a new complete listener for every new mount
    // Uppy should be configured on mount, and be closed on form unmount...
    if (!listenerAdded) {
      uppy.on('upload-success', (file: File) => {
        addFile({
          ...emptyFile,
          ...file,
        });
      });
      setListenerAdded(true);
    }
  }, [addFile, listenerAdded]);

  return (
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
  );
};

export default FileUploader;
