import React, { useContext } from 'react';
import { Tab } from '@material-ui/core';
import { ThemeContext } from 'styled-components';

interface LinkTabProps {
  error?: boolean;
  href?: string;
  label?: string;
}

const LinkTab: React.FC<LinkTabProps> = ({ error, ...rest }) => {
  const themeContext = useContext(ThemeContext);
  const styledTab = error ? { color: themeContext.palette.error.main } : undefined;

  return (
    <Tab
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
