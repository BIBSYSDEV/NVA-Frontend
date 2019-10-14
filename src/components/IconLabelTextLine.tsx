import React from 'react';

import { Icon } from '@material-ui/core';

export interface IconLabelTextLineProps {
  dataCy?: string;
  icon: string;
  label: string;
  text: string;
}

const IconLabelTextLine: React.FC<IconLabelTextLineProps> = ({ dataCy, icon, label, text }) => {
  return (
    <div className="line">
      <Icon>{icon}</Icon>
      <div className="label" data-cy={dataCy}>
        {label}
      </div>
      <div className="text">{text}</div>
    </div>
  );
};
export default IconLabelTextLine;
