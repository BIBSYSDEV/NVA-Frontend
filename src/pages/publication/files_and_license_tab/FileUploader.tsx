import React from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import Tus from '@uppy/tus';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import { useTranslation } from 'react-i18next';

const uppy = Uppy({
  autoProceed: true,
}).use(Tus, {
  endpoint: 'https://master.tus.io/files/',
});

interface FileUploaderProps {
  addFile: (file: any) => void;
}

const uploaderMaxWidthPx = 10000;
const uploaderMaxHeightPx = 200;

const FileUploader: React.FC<FileUploaderProps> = ({ addFile }) => {
  const { t } = useTranslation('publication');

  uppy.on('upload-success', uploadedFile => {
    addFile(uploadedFile);
  });

  return (
    <Dashboard
      uppy={uppy}
      proudlyDisplayPoweredByUppy={false}
      showSelectedFiles={false}
      showProgressDetails
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
