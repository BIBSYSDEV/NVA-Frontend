import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { Button } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';

import { getPublicationByDoi } from '../../../api/publicationApi';
import LinkPublicationForm, { DoiFormValues } from './LinkPublicationForm';
import PublicationExpansionPanel from './PublicationExpansionPanel';
import { Doi } from '../../../types/publication.types';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import { doiValidationSchema } from '../PublicationFormValidationSchema';

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
  const [noHit, setNoHit] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const createPublication = async () => {
    if (!doi) {
      return;
    }
    history.push(`/publication/${doi.identifier}`);
    openForm();
  };

  const handleSearch = async (values: DoiFormValues) => {
    // Cast values according to validation schema to ensure doiUrl is trimmed
    const trimmedValues = doiValidationSchema.cast(values);
    const doiUrl = trimmedValues?.doiUrl as string;
    const decodedDoiUrl = decodeURIComponent(doiUrl);

    setNoHit(false);
    setDoi(null);

    const doiPublication = await getPublicationByDoi(decodedDoiUrl);
    if (doiPublication?.error) {
      setNoHit(true);
      dispatch(setNotification(t('feedback:error.get_doi'), NotificationVariant.Error));
    } else if (!doiPublication) {
      setNoHit(true);
    } else {
      setDoi(doiPublication);
    }
  };

  return (
    <PublicationExpansionPanel
      headerLabel={t('publication:publication.start_with_link_to_publication')}
      icon={<LinkIcon className="icon" />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="publication-method-link"
      dataTestId="new-publication-link">
      <StyledBody>
        {t('publication:publication.link_publication_description')}
        <LinkPublicationForm handleSearch={handleSearch} />
        {noHit && <p>{t('common:no_hits')}</p>}
        {doi && (
          <>
            <StyledHeading> {t('publication:heading.publication')}:</StyledHeading>
            <StyledTitle>{doi.title}</StyledTitle>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={createPublication}
              data-testid="publication-link-next-button">
              {t('common:next')}
            </Button>
          </>
        )}
      </StyledBody>
    </PublicationExpansionPanel>
  );
};

export default LinkPublicationPanel;
