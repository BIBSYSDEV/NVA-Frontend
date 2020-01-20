import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useHistory } from 'react-router';

import { Button } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';

import { getPublicationByDoi } from '../../../api/publicationApi';
import LinkPublicationForm from './LinkPublicationForm';
import PublicationExpansionPanel from './PublicationExpansionPanel';
import { Doi } from '../../../types/publication.types';

const StyledBody = styled.div`
  width: 100%;
`;

const StyledHeading = styled.span`
  font-size: 1.2rem;
  margin: 1rem 0;
`;

const StyledTitle = styled.div`
  font-weight: bold;
  margin-bottom: 1rem;
`;

interface LinkPublicationPanelProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  openForm: () => void;
}

const LinkPublicationPanel: FC<LinkPublicationPanelProps> = ({ expanded, onChange, openForm }) => {
  const { t } = useTranslation();
  const [doi, setDoi] = useState<Doi | null>(null);
  const [loading, setLoading] = useState(false);
  const [noHit, setNoHit] = useState(false);
  const history = useHistory();

  const createPublication = async () => {
    if (!doi) {
      return;
    }
    // TODO: Create new publication with DOI

    // TODO: Set created publication id as URL param
    history.push({ search: `?title=${doi.title}` });
    openForm();
  };

  const handleSearch = async (values: any) => {
    setLoading(true);
    setNoHit(false);
    setDoi(null);

    const doiPublication = await getPublicationByDoi(values.doiUrl);
    if (doiPublication) {
      setDoi(doiPublication);
    } else {
      setNoHit(true);
    }
    setLoading(false);
  };

  return (
    <PublicationExpansionPanel
      headerLabel={t('publication:publication.link_to_publication')}
      icon={<LinkIcon className="icon" />}
      id="link-publication-panel"
      expanded={expanded}
      onChange={onChange}
      ariaControls="publication-method-link">
      <StyledBody>
        {t('publication:publication.link_publication_description')}
        <LinkPublicationForm handleSearch={handleSearch} />
        {loading && <p>{t('common:loading')}...</p>}
        {noHit && <p>{t('common:no_hits')}</p>}
        {doi && (
          <>
            <StyledHeading> {t('publication:heading.publication')}:</StyledHeading>
            <StyledTitle>{doi.title}</StyledTitle>
            <Button fullWidth color="primary" variant="contained" onClick={createPublication}>
              {t('common:next')}
            </Button>
          </>
        )}
      </StyledBody>
    </PublicationExpansionPanel>
  );
};

export default LinkPublicationPanel;
