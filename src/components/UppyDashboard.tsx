import React from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';
import styled from 'styled-components';
import { DashboardProps } from '@uppy/react/src/Dashboard';

const StyledDashboard = styled.div`
  overflow: auto;
`;

const uploaderMaxWidthPx = 10000;
const uploaderMaxHeightPx = 200;

export const UppyDashboard = (props: DashboardProps) => (
  <StyledDashboard>
    <Dashboard
      proudlyDisplayPoweredByUppy={false}
      showSelectedFiles={false}
      showProgressDetails
      hideProgressAfterFinish
      width={uploaderMaxWidthPx}
      height={uploaderMaxHeightPx}
      {...props}
    />
  </StyledDashboard>
);
