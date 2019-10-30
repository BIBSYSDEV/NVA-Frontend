import React from 'react';

export interface typeProps {
  type: string;
}

const PublicationSourceSelector: React.FC<typeProps> = ({ type }) => {
  return (
    <div className="publicationSelector">
      <div>Selector v</div>
      <div>{type}</div>
    </div>
  );
};

export default PublicationSourceSelector;
