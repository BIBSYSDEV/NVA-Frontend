import React, { ReactNode } from 'react';
import { Typography } from '@material-ui/core';

interface NormalTextProps {
  children: ReactNode;
}

const NormalText = ({ children, ...props }: NormalTextProps) => (
  <Typography variant="body1" {...props}>
    {children}
  </Typography>
);

export default NormalText;
