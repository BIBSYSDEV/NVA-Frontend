import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, DialogActions, TextField } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { RootStore } from '../../../redux/reducers/rootReducer';
import Card from '../../../components/Card';
import NormalText from '../../../components/NormalText';
import { PublicPublicationContentProps } from './PublicPublicationContent';
import Modal from '../../../components/Modal';

const StyledStatusBar = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    margin-left: 0.5rem;
  }
`;

const StyledStatusBarDescription = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.5rem;
    color: green;
  }
`;

export const PublicPublicationStatusBar: FC<PublicPublicationContentProps> = ({ publication }) => {
  const { t } = useTranslation('publication');
  const { id, isPublisher } = useSelector((store: RootStore) => store.user);

  const [openRequestDoi, setOpenRequestDoi] = useState(false);
  const toggleRequestDoi = () => setOpenRequestDoi((state) => !state);

  const {
    identifier,
    owner,
    status,
    entityDescription: {
      reference: { doi },
    },
  } = publication;
  const isOwner = owner === id;
  const hasDoi = !!doi;

  return isPublisher && isOwner ? (
    <StyledStatusBar>
      <StyledStatusBarDescription>
        <CheckCircleOutlineIcon fontSize="large" />
        <NormalText>
          {t('common:status')}: {t(`status:${status}`)}
        </NormalText>
      </StyledStatusBarDescription>
      <div>
        {!hasDoi && (
          <Button variant="contained" color="primary" onClick={toggleRequestDoi}>
            {t('public_page.request_doi')}
          </Button>
        )}
        <Link to={`/publication/${identifier}`}>
          <Button variant="contained" color="primary">
            {t('public_page.edit_publication')}
          </Button>
        </Link>
      </div>
      {!hasDoi && (
        <Modal
          open={openRequestDoi}
          maxWidth="sm"
          fullWidth
          onClose={toggleRequestDoi}
          headingText={t('public_page.request_doi')}>
          <NormalText>{t('public_page.request_doi_description')}</NormalText>
          <TextField variant="outlined" multiline rows="4" fullWidth label={t('public_page.message_to_curator')} />
          <DialogActions>
            <Button onClick={toggleRequestDoi}>{t('common:cancel')}</Button>
            <Button variant="contained" color="primary" onClick={toggleRequestDoi}>
              {t('common:send')}
            </Button>
          </DialogActions>
        </Modal>
      )}
    </StyledStatusBar>
  ) : null;
};
