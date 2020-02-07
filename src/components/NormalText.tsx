import React, { FC, ReactNode } from 'react';
import { Typography } from '@material-ui/core';

interface FormCardLabelProps {
  children: ReactNode;
}

const NormalText: FC<FormCardLabelProps> = ({ children, ...props }) => (
  <Typography variant="body1" {...props}>
    {children}
  </Typography>
);

export default NormalText;
