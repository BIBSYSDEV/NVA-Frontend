import React from 'react';
import { useTranslation } from 'react-i18next';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import PublicationExpansionPanel from './PublicationExpansionPanel';

interface LoadPublicationPanelProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
}

const LoadPublicationPanel: React.FC<LoadPublicationPanelProps> = ({ expanded, onChange }) => {
  const { t } = useTranslation();

  return (
    <PublicationExpansionPanel
      headerLabel={t('publication:publication.load_file')}
      icon={<CloudDownloadIcon />}
      id="load-publication-panel"
      expanded={expanded}
      onChange={onChange}
      ariaControls="publication-method-file">
      {t('publication:publication.load_file_description')}
    </PublicationExpansionPanel>
  );
};

export default LoadPublicationPanel;
