import React, { FC } from 'react';
import { Tab } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

interface LinkTabProps {
  error?: boolean;
  href?: string;
  label?: string;
}

const LinkTab: FC<LinkTabProps> = ({ error, ...rest }) => {
  const theme = useTheme();

  const styledTab = error ? { color: theme.palette.error.main } : undefined;

  return (
    <Tab
      className={error ? 'error-tab' : undefined}
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      style={styledTab}
      {...rest}
    />
  );
};

export default LinkTab;
