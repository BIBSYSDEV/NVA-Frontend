import React, { useEffect, useState } from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import Tus from '@uppy/tus';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import { useTranslation } from 'react-i18next';
import { File } from '../../../types/license.types';

const uppy = Uppy({
  autoProceed: true,
  restrictions: {
    allowedFileTypes: ['image/*', 'text/*', 'application/*'],
  },
}).use(Tus, {
  endpoint: 'https://master.tus.io/files/',
});

interface FileUploaderProps {
  addFile: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ addFile }) => {
  const { t } = useTranslation('publication');
  const [listenerAdded, setListenerAdded] = useState(false);

  useEffect(() => {
    // Ups: This will add a new complete listener for every new mount
    if (!listenerAdded) {
      uppy.on('upload-success', (file: File) => {
        addFile(file);
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
      width={10000}
      height={200}
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
