import React, { FC } from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';
import styled from 'styled-components';

import { Uppy } from '../types/file.types';

const StyledDashboard = styled.div`
  overflow: auto;
`;

interface UppyDashboardProps {
  uppy: Uppy;
}

const uploaderMaxWidthPx = 10000;
const uploaderMaxHeightPx = 200;

const UppyDashboard: FC<UppyDashboardProps> = ({ uppy }) => {
  return (
    <StyledDashboard>
      <Dashboard
        uppy={uppy}
        proudlyDisplayPoweredByUppy={false}
        showSelectedFiles={false}
        showProgressDetails
        hideProgressAfterFinish
        width={uploaderMaxWidthPx}
        height={uploaderMaxHeightPx}
      />
    </StyledDashboard>
  );
};

export default UppyDashboard;
