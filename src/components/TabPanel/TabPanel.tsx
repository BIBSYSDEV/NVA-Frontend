import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { YupError } from '../../types/validation.types';
import LabelTextLine from '../LabelTextLine';

interface TabPanelProps {
  ariaLabel: string;
  children?: React.ReactNode;
  currentTabNumber: number;
  errors?: YupError[];
  onClick: (event: React.MouseEvent<any>) => void;
  value: any;
}

const TabPanel: React.FC<TabPanelProps> = ({ ariaLabel, children, currentTabNumber, errors, onClick, value }) => {
  const { t } = useTranslation();

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== currentTabNumber}
      id={`nav-tabpanel-${ariaLabel}`}
      aria-labelledby={`nav-tab-${ariaLabel}`}>
      <Box>
        {errors &&
          errors.length > 0 &&
          errors.map((error: any) => {
            return <LabelTextLine key={error.path} label={error.path} text={`${error.name} - ${error.message}`} />;
          })}
        {children}
        {onClick && <Button onClick={onClick}>{t('Next')}</Button>}
      </Box>
    </Typography>
  );
};

export default TabPanel;
