import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';

import { createNewPublicationFromDoi, getPublicationByDoi } from '../../../api/publicationApi';
import { RootStore } from '../../../redux/reducers/rootReducer';
import LinkPublicationForm from './LinkPublicationForm';
import PublicationExpansionPanel from './PublicationExpansionPanel';

const StyledBody = styled.div`
  width: 100%;
`;

const StyledHeading = styled.div`
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
  const dispatch = useDispatch();
  const user = useSelector((state: RootStore) => state.user);

  const searchDoi = (evt: any) => {
    console.log(evt);
    dispatch(createNewPublicationFromDoi(doiUrl, user.id, dispatch));
  };

  const handleSearch = async (values: any) => {
    const publication = await getPublicationByDoi(values.doiUrl);
    console.log('res:', publication);
    setDoiTitle(publication.title);
    // setDoiUrl(values.doiUrl);
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
        {doiTitle && (
          <>
            <StyledHeading> {t('publication:heading.publication')}:</StyledHeading>
            <StyledTitle>{doiTitle}</StyledTitle>
            <Button fullWidth color="primary" variant="contained" onClick={evt => searchDoi(evt)}>
              {t('common:next')}
            </Button>
          </>
        )}
      </StyledBody>
    </PublicationExpansionPanel>
  );
};

export default LinkPublicationPanel;
