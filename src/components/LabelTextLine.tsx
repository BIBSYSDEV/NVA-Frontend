import React from 'react';

export interface LabelTextLineProps {
  label: string;
  text: string;
  dataCy?: string;
}

const LabelTextLine: React.FC<LabelTextLineProps> = ({ label, text, dataCy }) => (
  <div className="line">
    <div className="label">{label}:</div>
    <div className="text" data-cy={dataCy}>
      {text}
    </div>
  </div>
);

export default LabelTextLine;
