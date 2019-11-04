import React from 'react';

export interface LabelTextLineProps {
  label: string;
  text: string;
  dataTestId?: string;
}

const LabelTextLine: React.FC<LabelTextLineProps> = ({ label, text, dataTestId }) => (
  <div className="line">
    <div className="label">{label}:</div>
    <div className="text" data-testid={dataTestId}>
      {text}
    </div>
  </div>
);

export default LabelTextLine;
