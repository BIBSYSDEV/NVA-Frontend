import React from 'react';
import { useTranslation } from 'react-i18next';

import SearchIcon from '@material-ui/icons/Search';

import PublicationExpansionPanel from './PublicationExpansionPanel';

interface OrcidPublicationPanelProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
}

const OrcidPublicationPanel: React.FC<OrcidPublicationPanelProps> = ({ expanded, onChange }) => {
  const { t } = useTranslation('profile');

  return (
    <PublicationExpansionPanel
      headerLabel={t('orcid.suggestions')}
      icon={<SearchIcon className="icon" />}
      id="orcid-publication-panel"
      expanded={expanded}
      onChange={onChange}
      ariaControls="publication-method-orcid">
      {t('orcid.suggestions_description')}
    </PublicationExpansionPanel>
  );
};

export default OrcidPublicationPanel;
