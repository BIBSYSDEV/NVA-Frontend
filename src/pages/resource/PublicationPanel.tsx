import '../../styles/pages/resource/publication-panel.scss';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, TextField, Button } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinkIcon from '@material-ui/icons/Link';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SearchIcon from '@material-ui/icons/Search';

import { useTranslation } from 'react-i18next';

const PublicationPanel: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // do search
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
  <div className="publication-panel">
    <div className="header">{t('Choose publication')}</div>
    <div className="panel-content">
      <div className="selector-wrapper">
        <ExpansionPanel className="publication-selector">
          <ExpansionPanelSummary 
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1c-content"
              id="panel1c-header"
            >
            <CloudDownloadIcon className="icon"/> {t('Load file')}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {t('load_file_description')}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel className="publication-selector">
          <ExpansionPanelSummary 
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
          >
            <LinkIcon className="icon"/> {t('Link to publication')}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className="panel-details">
            <div className="link-description">
              {t('link_publication_description')}
            <div className="input-box">
              <TextField 
                id="ORCID-link" 
                label={t('ORCID-link')}
                onChange={handleChange}
                value={searchTerm}
              />
              <Button onClick={handleSearch}>{t('Search')}</Button>
            </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel className="publication-selector">
          <ExpansionPanelSummary 
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
          >
            <SearchIcon className="icon"/> {t('Suggestions from ORCID')}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {t('suggestions_from_ORCID_description')}
          </ExpansionPanelDetails>
        </ExpansionPanel> 
      </div>
      <div className="information-box">
        <div className="header">Information</div>
        <div className="content">
          Velg publikasjoner Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
          eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </div>
        <Link to={'/'}>Hvilken type publikasjoner kan jeg laste opp</Link>
      </div>
    </div>
  </div>
)};

export default PublicationPanel;
