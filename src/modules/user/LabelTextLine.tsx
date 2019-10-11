import '../../styles/user.scss';

import React from 'react';

export interface LabelTextLineProps {
  label: string;
  textValue: string;
}

const LabelTextLine: React.FC<LabelTextLineProps> = ({ label, textValue }) => (
  <div className="line">
    <div className="label">{label}:</div>
    <div className="value">{textValue}</div>
  </div>
);

export default LabelTextLine;
