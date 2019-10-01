import React, { ReactNode } from 'react';

import { IconButton as MUIIconButton } from '@material-ui/core';

export interface IconButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ children, className, onClick }) => (
  <div className={className}>
    <MUIIconButton onClick={onClick}>{children}</MUIIconButton>
  </div>
);

export default IconButton;
