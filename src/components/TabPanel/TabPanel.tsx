import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

interface TabPanelProps {
  ariaLabel: string;
  children?: React.ReactNode;
  tabNumber: number;
  value: any;
}

const TabPanel: React.FC<TabPanelProps> = ({ ariaLabel, children, tabNumber, value }) => (
  <Typography
    component="div"
    role="tabpanel"
    hidden={value !== tabNumber}
    id={`nav-tabpanel-${ariaLabel}`}
    aria-labelledby={`nav-tab-${ariaLabel}`}>
    <Box p={3}>{children}</Box>
  </Typography>
);

export default TabPanel;
