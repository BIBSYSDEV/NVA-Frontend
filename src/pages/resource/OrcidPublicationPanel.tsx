import React from 'react';
import PublicationExpansionPanel from './PublicationExpansionPanel';

import SearchIcon from '@material-ui/icons/Search';

import { useTranslation } from 'react-i18next';

interface OrcidPublicationPanelProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
}

const OrcidPublicationPanel: React.FC<OrcidPublicationPanelProps> = ({ expanded, onChange }) => {
  const { t } = useTranslation();

  return (
    <PublicationExpansionPanel
      headerLabel={t('Suggestions from ORCID')}
      icon={<SearchIcon className="icon" />}
      className="publication-selector"
      id="orcid-publication-panel"
      expanded={expanded}
      onChange={onChange}
      ariaControls="publication-method-orcid">
      {t('suggestions_from_ORCID_description')}
    </PublicationExpansionPanel>
  );
};

export default OrcidPublicationPanel;
