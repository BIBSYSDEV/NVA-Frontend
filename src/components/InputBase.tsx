import React from 'react';

import { InputBase as MUIInputBase } from '@material-ui/core';

export interface InputBaseProps {
  className?: string;
  placeholder?: string;
}

const InputBase: React.FC<InputBaseProps> = ({ className, placeholder }) => (
  <div className={className}>
    <MUIInputBase placeholder={placeholder} />
  </div>
);

export default InputBase;
