import '../../styles/user.scss';

import React from 'react';

export interface LabelTextLineProps {
  label: string;
  textValue: string;
  dataCy?: string;
}

const LabelTextLine: React.FC<LabelTextLineProps> = ({ label, textValue, dataCy }) => (
  <div className="line">
    <div className="label">{label}:</div>
    <div className="value" data-cy={dataCy}>
      {textValue}
    </div>
  </div>
);

export default LabelTextLine;
