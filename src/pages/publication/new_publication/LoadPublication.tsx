import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import PublicationExpansionPanel from './PublicationExpansionPanel';
import UppyDashboard from '../../../components/UppyDashboard';

interface LoadPublicationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  uppy: any;
  openForm: () => void;
}

const LoadPublication: React.FC<LoadPublicationProps> = ({ expanded, onChange, uppy, openForm }) => {
  const { t } = useTranslation('publication');

  const navigateToForm = useCallback(() => {
    openForm();
  }, [openForm]);

  useEffect(() => {
    if (uppy) {
      uppy.on('file-added', navigateToForm);
      return () => uppy.off('file-added', navigateToForm);
    }
  }, [uppy, navigateToForm]);

  return (
    <PublicationExpansionPanel
      headerLabel={t('publication:publication.load_file')}
      icon={<CloudDownloadIcon />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="publication-method-file">
      {uppy ? <UppyDashboard uppy={uppy} maxWidthPx={750} /> : null}
    </PublicationExpansionPanel>
  );
};

export default LoadPublication;
