import { Meta } from '@uppy/core';
import Dashboard, { DashboardProps } from '@uppy/react/dashboard';

import '@uppy/core/css/style.min.css';
import '@uppy/dashboard/css/style.min.css';

const uploaderMaxWidthPx = 1500;
const uploaderMaxHeightPx = 200;

export const UppyDashboard = (props: DashboardProps<Meta, Record<string, never>>) => (
  <Dashboard
    proudlyDisplayPoweredByUppy={false}
    showSelectedFiles={false}
    hideProgressAfterFinish
    width={uploaderMaxWidthPx}
    height={uploaderMaxHeightPx}
    {...props}
  />
);
