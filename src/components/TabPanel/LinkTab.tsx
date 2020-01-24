import React from 'react';

import { Tab } from '@material-ui/core';

interface LinkTabProps {
  error?: boolean;
  href?: string;
  label?: string;
}

const LinkTab: React.FC<LinkTabProps> = ({ error, ...rest }) => {
  const styledTab = error ? { color: '#ff5555' } : undefined;
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
