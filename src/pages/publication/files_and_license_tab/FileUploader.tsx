import React from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import Tus from '@uppy/tus';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import { useTranslation } from 'react-i18next';

const uppy = Uppy({
  autoProceed: true,
  restrictions: {
    allowedFileTypes: ['image/*', 'text/*', 'application/*'],
  },
}).use(Tus, {
  endpoint: 'https://master.tus.io/files/',
});

interface FileUploaderProps {
  addFiles: (files: any[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ addFiles }) => {
  const { t } = useTranslation('publication');

  uppy.on('complete', result => {
    if (result.successful.length) {
      addFiles(result.successful);
    }
  });

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
