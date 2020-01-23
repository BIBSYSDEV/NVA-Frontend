import React, { useEffect } from 'react';
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
  addFiles: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ addFiles }) => {
  const { t } = useTranslation('publication');

  useEffect(() => {
    // Ups: This will add a new complete listener for every new mount
    uppy.on('complete', result => {
      if (result.successful.length) {
        addFiles(result.successful);
      }
    });
  }, [addFiles]);

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
