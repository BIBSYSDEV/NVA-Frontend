import React from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import { Dashboard } from '@uppy/react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Uppy } from '../types/file.types';

const StyledDashboard = styled.div`
  overflow: auto;
`;

interface FileUploaderProps {
  uppy: Uppy;
}

const uploaderMaxWidthPx = 10000;
const uploaderMaxHeightPx = 200;

const UppyDashboard: React.FC<FileUploaderProps> = ({ uppy }) => {
  const { t } = useTranslation('publication');
  const multipleFilesAllowed = (uppy as any).opts.restrictions.maxNumberOfFiles !== 1;

  return uppy ? (
    <StyledDashboard>
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
            dropPaste: multipleFilesAllowed
              ? `${t('files_and_license.drag_files')} %{browse}`
              : `${t('files_and_license.drag_file')} %{browse}`,
            browse: t('files_and_license.browse'),
            dropHint: multipleFilesAllowed
              ? t('files_and_license.drop_here')
              : t('files_and_license.drop_single_file_here'),
            uploadXFiles: {
              0: t('files_and_license.upload_one_file'),
              1: t('files_and_license.upload_x_files'),
            },
            uploadXNewFiles: {
              0: t('files_and_license.upload_one_more_file'),
              1: t('files_and_license.upload_x_more_files'),
            },
          },
        }}
      />
    </StyledDashboard>
  ) : null;
};

export default UppyDashboard;
