import React from 'react';
import PublicationExpansionPanel from './PublicationExpansionPanel';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import { useTranslation } from 'react-i18next';

interface LoadPublicationPanelProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
}

const LoadPublicationPanel: React.FC<LoadPublicationPanelProps> = ({ expanded, onChange }) => {
  const { t } = useTranslation();

  return (
    <PublicationExpansionPanel
      headerLabel={t('Load file')}
      icon={<CloudDownloadIcon className="icon" />}
      className="publication-selector"
      id="load-publication-panel"
      expanded={expanded}
      onChange={onChange}
      ariaControls="publication-method-file">
      {t('load_file_description')}
    </PublicationExpansionPanel>
  );
};

export default LoadPublicationPanel;
