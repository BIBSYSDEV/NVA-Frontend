import React from 'react';
import PublicationExpansionPanel from './PublicationExpansionPanel';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import { useTranslation } from 'react-i18next';

interface LoadPanelProps {
    expanded: boolean;
    onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
}

const LoadPublicationPanel: React.FC<LoadPanelProps> = ({expanded, onChange}) => {
    const { t } = useTranslation();

    return (
        <PublicationExpansionPanel 
            headerLabel={t('Load file')} 
            icon={<CloudDownloadIcon className="icon"/>} 
            className="publication-selector"
            id="load-publication-panel"
            expanded={expanded}
            onChange={onChange}
        >
            {t('load_file_description')}
        </PublicationExpansionPanel>
    );
}

export default LoadPublicationPanel;