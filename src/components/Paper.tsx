import React, { ReactNode } from 'react';

import { Paper as MUIPaper } from '@material-ui/core';

export interface PaperProps {
  children: ReactNode;
  className?: string;
}

const Paper: React.FC<PaperProps> = ({ children, className }) => (
  <div className={className}>
    <MUIPaper>{children}</MUIPaper>
  </div>
);

export default Paper;
