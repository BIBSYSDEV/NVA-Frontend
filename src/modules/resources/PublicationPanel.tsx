import '../../styles/publicationpanel.scss';

import React from 'react';
import PublicationSourceSelector from './PublicationSourceSelector';

const PublicationPanel: React.FC = () => (
  <div className="publication">
    <div className="publicationChooser">
      <PublicationSourceSelector type="file"></PublicationSourceSelector>
      <PublicationSourceSelector type="link"></PublicationSourceSelector>
      <PublicationSourceSelector type="orcid"></PublicationSourceSelector>
    </div>
    <div className="information"></div>
  </div>
);

export default PublicationPanel;
