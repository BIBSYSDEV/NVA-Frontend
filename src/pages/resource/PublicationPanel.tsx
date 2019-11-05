import '../../styles/pages/resource/publication-panel.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import LoadPublicationPanel from './LoadPublicationPanel';
import LinkPublicationPanel from './LinkPublicationPanel';
import OrcidPublicationPanel from './OrcidPublicationPanel';

const PublicationPanel: React.FC = () => {
  const { t } = useTranslation();

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="publication-panel">
      <div className="header">{t('Choose publication')}</div>
      <div className="panel-content">
        <div className="selector-wrapper">
          <LoadPublicationPanel expanded={expanded === 'load-panel'} onChange={handleChange('load-panel')} />
          <LinkPublicationPanel expanded={expanded === 'link-panel'} onChange={handleChange('link-panel')} />
          <OrcidPublicationPanel expanded={expanded === 'orcid-panel'} onChange={handleChange('orcid-panel')} />
        </div>
        <div className="information-box">
          <div className="header">Information</div>
          <div className="content">
            Velg publikasjoner Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </div>
          <Link to={'/'}>Hvilken type publikasjoner kan jeg laste opp</Link>
        </div>
      </div>
    </div>
  );
};

export default PublicationPanel;
