import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import PublicationExpansionPanel from './PublicationExpansionPanel';
import LinkPublicationPanelForm from './LinkPublicationPanelForm';
import styled from 'styled-components';
import { createNewResourceFromDoi, lookupDoiTitle } from '../../api/resource';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';

const StyledBody = styled.div`
  width: 100%;
`;

const StyledHeading = styled.div`
  font-size: 1.2rem;
  padding: 10px 0;
`;

const StyledTitle = styled.div`
  font-weight: bold;
  margin-bottom: 1rem;
`;

interface LinkPublicationPanelProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  goToNextTab: () => void;
}

const LinkPublicationPanel: React.FC<LinkPublicationPanelProps> = ({ expanded, onChange, goToNextTab }) => {
  const { t } = useTranslation();
  const [doiUrl, setDoiUrl] = useState('');
  const [doiTitle, setDoiTitle] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state: RootStore) => state.user);

  const handleConfirmDOIMetadata = () => {
    dispatch(createNewResourceFromDoi(doiUrl, user.id));
    goToNextTab();
  };

  const handleSearch = async (values: any) => {
    const title = await lookupDoiTitle(values.doiUrl);
    setDoiTitle(title);
    setDoiUrl(values.doiUrl);
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
        <LinkPublicationPanelForm handleSearch={handleSearch} />
        {doiTitle && (
          <>
            <StyledHeading> {t('publication_panel.resource')}:</StyledHeading>
            <StyledTitle>{doiTitle}</StyledTitle>
            <Button fullWidth color="primary" variant="contained" onClick={handleConfirmDOIMetadata}>
              {t('publication_panel.next')}
            </Button>
          </>
        )}
      </StyledBody>
    </PublicationExpansionPanel>
  );
};

export default LinkPublicationPanel;
