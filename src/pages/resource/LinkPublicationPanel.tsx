import React, { useState } from 'react';
import PublicationExpansionPanel from './PublicationExpansionPanel';
import { TextField, Button } from '@material-ui/core';

import LinkIcon from '@material-ui/icons/Link';

import { useTranslation } from 'react-i18next';

interface LinkPanelProps {
    expanded: boolean;
    onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
}

const LinkPublicationPanel: React.FC<LinkPanelProps> = ({expanded, onChange}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useTranslation();

    const handleSearch = () => {
      // do search
    };
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
      };

    return (
        <PublicationExpansionPanel 
            headerLabel={t('Link to publication')} 
            icon={<LinkIcon className="icon"/>} 
            className="publication-selector"
            id="link-publication-panel"
            expanded={expanded}
            onChange={onChange}
            ariaControls="publication-method-link"
        >
        <div className="link-description">
            {t('link_publication_description')}
        <div className="input-box">
            <TextField id="ORCID-link" label={t('ORCID-link')} onChange={handleChange} value={searchTerm}/>
            <Button onClick={handleSearch}>{t('Search')}</Button>
        </div>
        </div>
        </PublicationExpansionPanel>
    );
}

export default LinkPublicationPanel;