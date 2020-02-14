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
            dropPaste: `${t('files_and_license.drag_files')} %{browse}`,
            browse: t('files_and_license.browse'),
            dropHint: t('files_and_license.drop_here'),
          },
        }}
      />
    </StyledDashboard>
  ) : null;
};

export default UppyDashboard;
