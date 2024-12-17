import { Meta } from '@uppy/core';
import { Dashboard } from '@uppy/react';
import { DashboardProps } from '@uppy/react/lib/Dashboard';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

const uploaderMaxWidthPx = 1500;
const uploaderMaxHeightPx = 200;

export const UppyDashboard = (props: DashboardProps<Meta, Record<string, never>>) => (
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
