import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, TextField } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';

import PublicationExpansionPanel from './PublicationExpansionPanel';
import styled from 'styled-components';

const StyledInputBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
`;

const StyledTextField = styled(TextField)`
  margin-right: 1rem;
`;

const StyledBody = styled.div`
  width: 100%;
`;

interface LinkPublicationPanelProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
}

const LinkPublicationPanel: React.FC<LinkPublicationPanelProps> = ({ expanded, onChange }) => {
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
      headerLabel={t('publication_panel.link_to_publication')}
      icon={<LinkIcon className="icon" />}
      id="link-publication-panel"
      expanded={expanded}
      onChange={onChange}
      ariaControls="publication-method-link">
      <StyledBody>
        {t('publication_panel.link_publication_description')}
        <StyledInputBox>
          <StyledTextField
            margin="dense"
            id="ORCID-link"
            variant="outlined"
            label={t('publication_panel.ORCID-link')}
            onChange={handleChange}
            value={searchTerm}
          />
          <Button color="primary" variant="contained" onClick={handleSearch}>
            {t('publication_panel.search')}
          </Button>
        </StyledInputBox>
      </StyledBody>
    </PublicationExpansionPanel>
  );
};

export default LinkPublicationPanel;
