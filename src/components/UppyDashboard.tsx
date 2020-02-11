import React from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import { Dashboard } from '@uppy/react';
import { useTranslation } from 'react-i18next';

interface FileUploaderProps {
  uppy: any;
  maxWidthPx?: number;
  maxHeightPx?: number;
}

const UppyDashboard: React.FC<FileUploaderProps> = ({ uppy, maxWidthPx = 2000, maxHeightPx = 200 }) => {
  const { t } = useTranslation('publication');

  return uppy ? (
    <Dashboard
      uppy={uppy}
      proudlyDisplayPoweredByUppy={false}
      showSelectedFiles={false}
      showProgressDetails
      hideProgressAfterFinish
      width={maxWidthPx}
      height={maxHeightPx}
      locale={{
        strings: {
          dropPaste: `${t('files_and_license.drag_files')} %{browse}`,
          browse: t('files_and_license.browse'),
        },
      }}
    />
  ) : null;
};

export default UppyDashboard;
