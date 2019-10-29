import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

interface TabPanelProps {
  children?: React.ReactNode;
  tabNumber: number;
  value: any;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, tabNumber, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== tabNumber}
      id={`nav-tabpanel-${tabNumber}`}
      aria-labelledby={`nav-tab-${tabNumber}`}
      {...other}>
      <Box p={3}>{children}</Box>
    </Typography>
  );
};

export default TabPanel;
