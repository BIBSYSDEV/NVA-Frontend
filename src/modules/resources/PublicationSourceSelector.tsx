import React from 'react';

export interface typeProps {
  type: string;
}

const PublicationSourceSelector: React.FC<typeProps> = ({ type }) => {
  return (
    <div className="publication-selector">
      <div>Selector v</div>
      <div>{type}</div>
    </div>
  );
};

export default PublicationSourceSelector;
