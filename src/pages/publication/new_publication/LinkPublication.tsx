import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Button } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';

import { createNewPublicationFromDoi, getPublicationByDoi } from '../../../api/publicationApi';
import LinkPublicationForm from './LinkPublicationForm';
import PublicationExpansionPanel from './PublicationExpansionPanel';

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
}

const LinkPublicationPanel: FC<LinkPublicationPanelProps> = ({ expanded, onChange }) => {
  const { t } = useTranslation();
  const [doiUrl, setDoiUrl] = useState('');
  const [doiTitle, setDoiTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [noHit, setNoHit] = useState(false);
  const dispatch = useDispatch();

  const createPublication = async () => {
    // eslint-disable-next-line
    const createdPublication = await createNewPublicationFromDoi(doiUrl, dispatch);
    // TODO: If valid link: Open form prefilled with values from createdPublicaiton (NP-229)
  };

  const handleSearch = async (values: any) => {
    setLoading(true);
    setNoHit(false);
    setDoiTitle('');
    setDoiUrl('');

    const publication = await getPublicationByDoi(values.doiUrl);
    if (publication) {
      setDoiTitle(publication.title);
      setDoiUrl(publication.id);
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
        {doiTitle && (
          <>
            <StyledHeading> {t('publication:heading.publication')}:</StyledHeading>
            <StyledTitle>{doiTitle}</StyledTitle>
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
