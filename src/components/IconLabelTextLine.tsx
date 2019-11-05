import React from 'react';

import { Icon } from '@material-ui/core';

interface IconLabelTextLineProps {
  dataTestId?: string;
  icon: string;
  label: string;
  text: string;
}

const IconLabelTextLine: React.FC<IconLabelTextLineProps> = ({ dataTestId, icon, label, text }) => {
  return (
    <div className="line">
      <Icon>{icon}</Icon>
      <div className="label" data-testid={dataTestId}>
        {label}
      </div>
      <div className="text">{text}</div>
    </div>
  );
};
export default IconLabelTextLine;
