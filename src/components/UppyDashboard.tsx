import { Dashboard } from '@uppy/react';
import { DashboardProps } from '@uppy/react/types/Dashboard';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

const uploaderMaxWidthPx = 1500;
const uploaderMaxHeightPx = 200;

export const UppyDashboard = (props: DashboardProps) => (
  <Dashboard
    proudlyDisplayPoweredByUppy={false}
    showSelectedFiles={false}
    showProgressDetails
    hideProgressAfterFinish
    width={uploaderMaxWidthPx}
    height={uploaderMaxHeightPx}
    {...props}
  />
);
